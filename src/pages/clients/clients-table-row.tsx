import { Search, Trash2, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { ClientDetails, ClientDetailsProps } from "./client-details";

// Definimos que este componente espera receber um objeto do tipo Client
interface ClientsTableRowProps {
  client: ClientDetailsProps;
}

export function ClientsTableRow({ client }: ClientsTableRowProps) {
  // Função para formatar a moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
            </Button>
          </DialogTrigger>

          {/* Passamos o objeto 'client' inteiro para os detalhes usando o spread operator (...) */}
          <ClientDetails {...client} />
        </Dialog>
      </TableCell>

      {/* Exibindo os dados REAIS do banco */}
      <TableCell className="text-sm font-medium">{client.name}</TableCell>
      <TableCell>{formatCurrency(Number(client.value))}</TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${client.lateInstallments > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
          ></span>
          <span className="font-medium text-muted-foreground">
            {client.lateInstallments > 0 ? "Atrasado" : "Em dia"}
          </span>
        </div>
      </TableCell>

      {/* Aqui você pode usar a data do próximo pagamento vinda da API */}
      <TableCell>
        {client.nextPaymentDate
          ? new Date(client.nextPaymentDate).toLocaleDateString("pt-BR")
          : "---"}
      </TableCell>

      <TableCell>
        <Button variant="outline" size="sm">
          <UserCog className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Excluir
        </Button>
      </TableCell>
    </TableRow>
  );
}
