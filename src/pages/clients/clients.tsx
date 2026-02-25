import { useEffect, useState } from "react";
// Adicionado useEffect
import { Helmet } from "react-helmet-async";

// Importando sua instância configurada

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
import { ClientTableFilters } from "./client-table-filters";
import { ClientsTableRow } from "./clients-table-row";

export function Clients() {
  // Agora com funções de atualização (set...)
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<ClientDetailsProps[]>([]);

  // Função para buscar dados do Back-end
  async function fetchClients() {
    try {
      setIsLoading(true);
      const response = await api.get("/clients"); // Bate em http://localhost:3333/api/clients
      setClients(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Dispara a busca assim que o componente monta
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
      <Helmet title="Clientes" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>
      <div className="space-y-2.5">
        <ClientTableFilters />
      </div>
      <div className="border rounded-md ">
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
            ) : clients.length > 0 ? (
              clients.map((client) => (
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
      {/* totalCount dinâmico baseado no tamanho da lista */}
      <Pagination pageIndex={0} totalCount={clients.length} perPage={10} />
    </>
  );
}
