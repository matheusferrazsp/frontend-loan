import { Plus } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
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

import { ClientDetailsProps } from "./client-details";
import { ClientTableFilters, FilterData } from "./client-table-filters";
// Importe FilterData aqui
import { ClientsTableRow } from "./clients-table-row";
import { CreateClientDialog } from "./create-client-dialog";

export function Clients() {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<ClientDetailsProps[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientDetailsProps[]>(
    [],
  );

  // 1. Função para buscar dados do Back-end
  async function fetchClients() {
    try {
      setIsLoading(true);
      const response = await api.get("/clients");

      // Força a garantia de que estamos lidando com um Array
      const data = Array.isArray(response.data) ? response.data : [];

      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setClients([]); // Reset para array vazio em caso de erro
      setFilteredClients([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Lógica de filtragem em tempo real
  const handleFilter = useCallback(
    (data: FilterData) => {
      setFilteredClients((prevFiltered) => {
        const filtered = clients.filter((client) => {
          const matchName = client.name
            .toLowerCase()
            .includes(data.name.toLowerCase());

          const matchStatus =
            data.status === "all"
              ? true
              : data.status === "debtor"
                ? client.lateInstallments > 0
                : client.lateInstallments === 0;

          const matchDate = data.date
            ? client.nextPaymentDate?.includes(data.date)
            : true;

          return matchName && matchStatus && matchDate;
        });

        // Só atualiza se o resultado for diferente para evitar renders desnecessários
        if (JSON.stringify(prevFiltered) === JSON.stringify(filtered)) {
          return prevFiltered;
        }
        return filtered;
      });
    },
    [clients],
  );

  return (
    <>
      <Helmet title="Clientes" />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <div className="space-y-2.5 mt-4">
        <ClientTableFilters onFilter={handleFilter} />
      </div>

      <div className="flex items-center justify-between mt-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo cliente
            </Button>
          </DialogTrigger>
          <CreateClientDialog />
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-[64px]"></TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Mensalidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="w-[164px]">Editar</TableHead>
              <TableHead className="w-[132px]">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Carregando clientes...
                </TableCell>
              </TableRow>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ClientsTableRow key={client.id} client={client} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação baseada na lista filtrada */}
      <Pagination
        pageIndex={0}
        totalCount={filteredClients.length}
        perPage={10}
      />
    </>
  );
}
