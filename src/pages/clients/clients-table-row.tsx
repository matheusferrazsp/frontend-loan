import { Loader2, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
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
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export function ClientsTableRow({
  client,
  onDelete,
  onUpdate,
}: ClientsTableRowProps) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const openClientId = searchParams.get("openClientId");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (openClientId === client.id) {
      setIsDetailsOpen(true);
    }
  }, [openClientId, client.id]);

  const handleOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open && openClientId === client.id) {
      searchParams.delete("openClientId");
      searchParams.delete("clientName");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const getStatusDisplay = () => {
    if (client.isDelinquent) {
      return {
        text: "Inadimplente",
        textColor: "text-rose-500",
        dotColor: "bg-rose-500",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = client.nextPaymentDate
      ? new Date(client.nextPaymentDate)
      : null;

    if (dueDate) {
      const dueDateZero = new Date(
        dueDate.getUTCFullYear(),
        dueDate.getUTCMonth(),
        dueDate.getUTCDate(),
      );

      const isToday = dueDateZero.getTime() === today.getTime();
      const isPast = dueDateZero < today;
      // Prioridade 1: Vence HOJE (Amarelo)
      if (isToday) {
        return {
          text: "Vence hoje",
          textColor: "text-amber-500",
          dotColor: "bg-amber-500",
        };
      }

      // Prioridade 2: Venceu e tem parcelas em atraso (Vermelho)
      if (isPast || client.lateInstallments > 0) {
        return {
          text: "Atrasado",
          textColor: "text-rose-500",
          dotColor: "bg-rose-500",
        };
      }
    }

    // Padrão: Em dia (Verde)
    return {
      text: "Em dia",
      textColor: "text-emerald-500",
      dotColor: "bg-emerald-500",
    };
  };

  const status = getStatusDisplay();

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);

      await api.delete(`/clients/${client.id}`);

      toast.success("Cliente removido com sucesso!");

      onDelete(client.id);
    } catch (error) {
      toast.error("Não foi possível excluir o cliente.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isDetailsOpen} onOpenChange={handleOpenChange}>
      <TableRow>
        <TableCell className="hidden md:table-cell w-[64px]">
          <DialogTrigger asChild>
            <Button variant="outline" size="xs" className="-ml-2 md:ml-0">
              <Search className="h-3 w-3 md:size-4" />
            </Button>
          </DialogTrigger>
        </TableCell>

      <TableCell className="text-sm font-medium">
        <div className="flex flex-col items-start">
          <DialogTrigger asChild>
            <button className="text-left font-bold text-blue-400 underline decoration-blue-400/50 md:text-foreground md:no-underline md:hover:no-underline md:font-medium transition-colors hover:text-blue-400/80 md:cursor-text">
              {client.name}
            </button>
          </DialogTrigger>
          <span className="text-muted-foreground md:hidden">
            {Number(client.monthlyPaid).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {Number(client.monthlyPaid).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`whitespace-nowrap font-medium text-xs md:text-sm  ${status.textColor}`}
          >
            {status.text}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Button variant="ghost" size="xs" className="w-full md:w-fit print:hidden">
          {client.nextPaymentDate
            ? new Date(client.nextPaymentDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })
            : "---"}
        </Button>
        <span className="hidden print:inline text-sm">
          {client.nextPaymentDate
            ? new Date(client.nextPaymentDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })
            : "---"}
        </span>
      </TableCell>

      <TableCell className="hidden print:table-cell text-sm">
        {client.lastPaymentDate
          ? new Date(client.lastPaymentDate).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })
          : "---"}
      </TableCell>

      <TableCell className="print:hidden">
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserCog className="md:mr-1 h-3 w-3" />
              <span className="hidden md:inline">Editar</span>
            </Button>
          </DialogTrigger>
          <UpdateClientDialog
            client={client}
            setOpen={setIsUpdateOpen}
            onSuccess={onUpdate}
          />
        </Dialog>
      </TableCell>

      <TableCell className="print:hidden">
        {/* COMPONENTE DE CONFIRMAÇÃO DO SHADCN */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              <span className="hidden md:inline">Excluir</span>
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
    <ClientDetails {...client} />
  </Dialog>
  );
}
