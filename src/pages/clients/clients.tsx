import { FileDown, Plus, Sheet } from "lucide-react";
// 1. IMPORTAÇÃO DO SOCKET.IO
import { io } from "socket.io-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/axios";
import { exportarCSV } from "@/lib/exportCSV";
import { printHtml } from "@/lib/printHtml";

import { ClientDetailsProps } from "./client-details";
import { ClientTableFilters, FilterData } from "./client-table-filters";
import { ClientsTableRow } from "./clients-table-row";
import { CreateClientDialog } from "./create-client-dialog";

export function Clients() {
  const defaultFilters: FilterData = {
    name: "",
    date: "",
    status: "all",
    debtStatus: "pending",
  };

  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<ClientDetailsProps[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientDetailsProps[]>(
    [],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const activeFiltersRef = useRef<FilterData>(defaultFilters);

  const applyFilters = useCallback(
    (clientList: ClientDetailsProps[], data: FilterData) => {
      return clientList.filter((client) => {
        // Excluir clientes inadimplentes
        if (client.isDelinquent) return false;

        const matchName = client.name
          .toLowerCase()
          .includes(data.name.toLowerCase());

        const matchStatus =
          data.status === "all"
            ? true
            : data.status === "due"
              ? (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (!client.nextPaymentDate) return false;

                  const dueDate = new Date(client.nextPaymentDate);
                  const dueDateZero = new Date(
                    dueDate.getUTCFullYear(),
                    dueDate.getUTCMonth(),
                    dueDate.getUTCDate(),
                  );

                  return dueDateZero.getTime() === today.getTime();
                })()
              : data.status === "debtor"
                ? client.lateInstallments > 0
                : client.lateInstallments === 0;

        const matchDate = data.date
          ? (() => {
              let searchDate = data.date;
              if (searchDate.includes("/")) {
                const parts = searchDate.split("/");
                if (parts.length === 3) {
                  searchDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else if (parts.length === 2) {
                  searchDate = `${parts[1]}-${parts[0]}`;
                }
              }
              return client.nextPaymentDate?.includes(searchDate);
            })()
          : true;

        const clientDebtPaid =
          client.totalDebtPaid === true ||
          (typeof client.totalDebtPaid === "string" &&
            client.totalDebtPaid === "true");

        const matchDebtStatus =
          data.debtStatus === "paid" ? clientDebtPaid : !clientDebtPaid;

        return matchName && matchStatus && matchDate && matchDebtStatus;
      });
    },
    [],
  );

  // 1. Função de busca protegida com useCallback (Melhor prática React)
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/clients");
      const data = Array.isArray(response.data) ? response.data : [];
      setClients(data);
      setFilteredClients(applyFilters(data, activeFiltersRef.current));
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setClients([]);
      setFilteredClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    fetchClients();

    // -- CONEXÃO WEBSOCKET --

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
    const socket = io(backendUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor WebSocket no Frontend!");
    });

    socket.on("disconnect", () => {
      console.log(
        "🔴 Desconectado do servidor WebSocket, tentando reconectar...",
      );
    });

    socket.on("clientesAtualizados", () => {
      console.log("🔄 Atualização em tempo real recebida!");
      fetchClients();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchClients();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      socket.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchClients]);

  const paginatedClients = useMemo(() => {
    const start = pageIndex * 10;
    const end = start + 10;
    return filteredClients.slice(start, end);
  }, [filteredClients, pageIndex]);

  // Lógica de filtragem em tempo real
  const handleFilter = useCallback(
    (data: FilterData) => {
      activeFiltersRef.current = data;
      setPageIndex(0);
      setFilteredClients((prevFiltered) => {
        const filtered = applyFilters(clients, data);

        if (JSON.stringify(prevFiltered) !== JSON.stringify(filtered)) {
          setPageIndex(0);
          return filtered;
        }

        return prevFiltered;
      });
    },
    [applyFilters, clients],
  );

  // Lógica de exclusão de cliente
  function onDeleteSuccess(clientId: string) {
    setClients((prev) => prev.filter((client) => client.id !== clientId));

    setFilteredClients((prev) =>
      prev.filter((client) => client.id !== clientId),
    );

    if (paginatedClients.length === 1 && pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  }

  function printClientsTable() {
    const formatCurrency = (value: number) =>
      Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

    const formatDate = (dateString: string) => {
      if (!dateString) return "---";
      return new Date(dateString).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });
    };

    const getStatus = (client: (typeof filteredClients)[0]) => {
      if (client.isDelinquent)
        return { text: "Inadimplente", color: "#dc2626" };
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (client.nextPaymentDate) {
        const due = new Date(client.nextPaymentDate);
        const dueZero = new Date(
          due.getUTCFullYear(),
          due.getUTCMonth(),
          due.getUTCDate(),
        );
        if (dueZero.getTime() === today.getTime())
          return { text: "Vence hoje", color: "#d97706" };
        if (dueZero < today || client.lateInstallments > 0)
          return { text: "Atrasado", color: "#dc2626" };
      }
      return { text: "Em dia", color: "#16a34a" };
    };

    const rows = filteredClients
      .map((c) => {
        const status = getStatus(c);
        return `
        <tr>
          <td>${c.name}</td>
          <td style="text-align:right">${formatCurrency(c.monthlyPaid)}</td>
          <td style="color:${status.color};font-weight:600">${status.text}</td>
          <td style="text-align:right">${formatDate(c.nextPaymentDate)}</td>
          <td style="text-align:right">${formatDate(c.lastPaymentDate)}</td>
        </tr>`;
      })
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relat\u00f3rio de Empr\u00e9stimos</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; background: #f9fafb; color: #6b7280; font-size: 11px; font-weight: 600; padding: 8px 10px; border-bottom: 2px solid #e5e7eb; }
          td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
          tr:hover td { background: #f9fafb; }
          .footer { margin-top: 32px; font-size: 10px; color: #9ca3af; text-align: right; }
          .count { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>Relat\u00f3rio de Empr\u00e9stimos</h1>
        <p class="subtitle">Gerado em ${new Date().toLocaleString("pt-BR")}</p>
        <p class="count">${filteredClients.length} cliente(s) listado(s)</p>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th style="text-align:right">Mensalidade</th>
              <th>Status</th>
              <th style="text-align:right">Vencimento</th>
              <th style="text-align:right">\u00dalt. Pagamento</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="footer">VeroFlux \u00b7 ${window.location.hostname}</p>
      </body>
      </html>`;

    printHtml(html);
  }

  return (
    <div className="p-0 md:p-8 flex flex-col gap-4">
      <Helmet title="Empréstimos" />

      <div className="flex flex-col gap-4 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
      </div>

      <div className="space-y-2.5 mt-4 print:hidden">
        <ClientTableFilters onFilter={handleFilter} />
      </div>

      <div className="flex items-center justify-between mt-4 mb-4 print:hidden">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={printClientsTable}>
            <FileDown className="h-4 w-4 mr-1.5" />
            <span className="md:hidden">PDF</span>
            <span className="hidden md:inline">Imprimir Tabela</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              exportarCSV(
                filteredClients,
                [
                  { titulo: "Nome", chave: "name" },
                  { titulo: "CPF", chave: "cpf" },
                  { titulo: "Telefone", chave: "phone" },
                  { titulo: "E-mail", chave: "email" },
                  { titulo: "Endereço", chave: "address" },
                  {
                    titulo: "Valor do Empréstimo",
                    formatar: (c) =>
                      Number(c.value).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                  },
                  {
                    titulo: "Mensalidade",
                    formatar: (c) =>
                      Number(c.monthlyPaid).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                  },
                  { titulo: "Parcelas", chave: "installments" },
                  { titulo: "Parcelas Pagas", chave: "installmentsPaid" },
                  { titulo: "Parcelas em Atraso", chave: "lateInstallments" },
                  {
                    titulo: "Valor Pago",
                    formatar: (c) =>
                      Number(c.valuePaid).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                  },
                  {
                    titulo: "Data do Empréstimo",
                    formatar: (c) =>
                      c.loanDate
                        ? new Date(c.loanDate).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })
                        : "",
                  },
                  {
                    titulo: "Próximo Vencimento",
                    formatar: (c) =>
                      c.nextPaymentDate
                        ? new Date(c.nextPaymentDate).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" },
                          )
                        : "",
                  },
                  {
                    titulo: "Última Data de Pagamento",
                    formatar: (c) =>
                      c.lastPaymentDate
                        ? new Date(c.lastPaymentDate).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" },
                          )
                        : "",
                  },
                  {
                    titulo: "Status",
                    formatar: (c) =>
                      c.isDelinquent ? "Inadimplente" : "Em dia",
                  },
                  {
                    titulo: "Dívida Quitada",
                    formatar: (c) => (c.totalDebtPaid ? "Sim" : "Não"),
                  },
                ],
                "clientes.csv",
              )
            }
          >
            <Sheet className="h-4 w-4 mr-1.5" />
            <span className="md:hidden">CSV</span>
            <span className="hidden md:inline">Exportar CSV</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                <span className="md:hidden">Novo</span>
                <span className="hidden md:inline">Novo cliente</span>
              </Button>
            </DialogTrigger>
            <CreateClientDialog onSuccess={fetchClients} />
          </Dialog>
        </div>
      </div>

      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold">Relatório de Empréstimos</h1>
      </div>

      <div className="border rounded-md overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell w-[64px]"></TableHead>
              <TableHead>Cliente/Juros</TableHead>
              <TableHead className="hidden md:table-cell">
                Mensalidade
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="hidden print:table-cell">
                Últ. Pagamento
              </TableHead>
              <TableHead className="w-[164px] print:hidden">Editar</TableHead>
              <TableHead className="w-[132px] print:hidden">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginatedClients.length > 0 ? (
              paginatedClients.map((client) => (
                <ClientsTableRow
                  key={client.id}
                  client={client}
                  onDelete={onDeleteSuccess}
                  onUpdate={fetchClients}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhum cliente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="print:hidden">
        <Pagination
          pageIndex={pageIndex}
          totalCount={filteredClients.length}
          perPage={10}
          onPageChange={(page) => {
            console.log("Indo para a página:", page);
            setPageIndex(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
