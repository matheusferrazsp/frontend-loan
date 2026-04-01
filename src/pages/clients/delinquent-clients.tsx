import { io } from "socket.io-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

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

import { ClientDetailsProps } from "./client-details";
import { ClientTableFilters, FilterData } from "./client-table-filters";
import { ClientsTableRow } from "./clients-table-row";

export function DelinquentClients() {
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
        if (!client.isDelinquent) {
          return false;
        }

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
                ? client.isDelinquent
                : !client.isDelinquent;

        const matchDate = data.date
          ? client.nextPaymentDate?.includes(data.date)
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

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/clients");
      const data = Array.isArray(response.data) ? response.data : [];
      setClients(data);
      setFilteredClients(applyFilters(data, activeFiltersRef.current));
    } catch (error) {
      console.error("Erro ao carregar clientes inadimplentes:", error);
      setClients([]);
      setFilteredClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    fetchClients();

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
    const socket = io(backendUrl);

    socket.on("clientesAtualizados", () => {
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

  function onDeleteSuccess(clientId: string) {
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    setFilteredClients((prev) =>
      prev.filter((client) => client.id !== clientId),
    );

    if (paginatedClients.length === 1 && pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  }

  return (
    <div className="p-0 md:p-8 flex flex-col gap-4">
      <Helmet title="Inadimplentes" />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Clientes inadimplentes
        </h1>
        <p className="text-sm text-muted-foreground">
          Lista de clientes marcados manualmente como inadimplentes.
        </p>
      </div>

      <div className="space-y-2.5 mt-4">
        <ClientTableFilters onFilter={handleFilter} />
      </div>

      <div className="-mx-5 md:mx-0 border-y md:border-x md:rounded-md overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-[64px] w-[32px]"></TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">
                Mensalidade
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="w-[164px]">Editar</TableHead>
              <TableHead className="w-[132px]">Excluir</TableHead>
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
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhum cliente inadimplente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        pageIndex={pageIndex}
        totalCount={filteredClients.length}
        perPage={10}
        onPageChange={(page) => {
          setPageIndex(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
