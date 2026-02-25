import { Loader2, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/axios";

import { ClientDetails, ClientDetailsProps } from "./client-details";
import { UpdateClientDialog } from "./update-client-dialog";

interface ClientsTableRowProps {
  client: ClientDetailsProps;
}

export function ClientsTableRow({ client }: ClientsTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);

      await api.delete(`/clients/${client.id}`);

      toast.success("Cliente removido com sucesso!");

      window.location.reload();
    } catch (error) {
      toast.error("Não foi possível excluir o cliente.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <ClientDetails {...client} />
        </Dialog>
      </TableCell>

      <TableCell className="text-sm font-medium">{client.name}</TableCell>
      <TableCell>
        {Number(client.value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${client.lateInstallments > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
          />
          <span className="font-medium text-muted-foreground">
            {client.lateInstallments > 0 ? "Atrasado" : "Em dia"}
          </span>
        </div>
      </TableCell>

      <TableCell>
        {client.nextPaymentDate
          ? new Date(client.nextPaymentDate).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })
          : "---"}
      </TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserCog className="mr-1 h-3 w-3" />
              Editar
            </Button>
          </DialogTrigger>
          <UpdateClientDialog client={client} />
        </Dialog>
      </TableCell>

      <TableCell>
        {/* COMPONENTE DE CONFIRMAÇÃO DO SHADCN */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Excluir
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a excluir o cliente{" "}
                <strong>{client.name}</strong>. Esta ação é permanente e
                removerá todos os registros vinculados.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteClient}
                disabled={isDeleting}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirmar Exclusão"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
