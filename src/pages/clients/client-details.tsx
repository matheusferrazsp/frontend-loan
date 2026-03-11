import { Loader2, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/axios";

interface ClientPayment {
  id: string;
  amount: number;
  date: string;
  note?: string | null;
}

export interface ClientDetailsProps {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  value: number;
  loanInterest: number;
  installments: number;
  installmentsPaid: number;
  lateInstallments: number;
  valuePaid: number;
  lastPaymentAmount: number;
  monthlyPaid: number;
  loanDate: string;
  nextPaymentDate: string;
  lastPaymentDate: string;
  monthlyFeePaid: boolean;
  totalDebtPaid: boolean;
  observations: string;
}

export function ClientDetails(props: ClientDetailsProps) {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(
    null,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPhoneDisplay = (v: string) => {
    if (!v) return "---";
    const cleaned = v.replace(/\D/g, "");
    return cleaned
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const whatsappNumber = props.phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/55${whatsappNumber}`;

  const handleDeletePayment = async (paymentId: string) => {
    try {
      setDeletingPaymentId(paymentId);

      await api.delete(`/clients/${props.id}/payments/${paymentId}`);

      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== paymentId),
      );

      toast.success("Pagamento removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
      toast.error("Erro ao remover pagamento.");
    } finally {
      setDeletingPaymentId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchPayments() {
      try {
        setIsLoadingPayments(true);
        setPaymentsError(null);

        const response = await api.get(`/clients/${props.id}/payments`);
        const paymentList = Array.isArray(response.data) ? response.data : [];

        if (isMounted) {
          setPayments(paymentList);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico de pagamentos:", error);

        if (isMounted) {
          setPayments([]);
          setPaymentsError("Não foi possível carregar o histórico.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPayments(false);
        }
      }
    }

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [props.id]);

  return (
    <DialogContent className="sm:max-w-[500px] w-[98vw] h-[85vh] p-0 flex flex-col rounded-lg overflow-x-hidden">
      <DialogHeader className="pt-8 px-6 pb-2">
        <DialogTitle className="break-all text-lg">
          Cliente: {props.name}
        </DialogTitle>
        <DialogDescription>Detalhes financeiros e cadastrais</DialogDescription>
      </DialogHeader>

      <div className="w-full flex-1 overflow-y-auto px-2 pb-6 scrollbar-thin ">
        <Table>
          <TableBody>
            {/* STATUS */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Status
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${props.lateInstallments > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                  />
                  <span className="font-medium text-sm">
                    {props.lateInstallments > 0 ? "Atrasado" : "Em dia"}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            {/* NOME */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Nome
              </TableCell>
              <TableCell className="text-right font-medium text-sm break-all">
                {props.name}
              </TableCell>
            </TableRow>

            {/* WHATSAPP */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Contato
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium text-sm">
                    {formatPhoneDisplay(props.phone)}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-600 h-7 px-2 text-[10px] gap-1"
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            {/* EMAIL E CPF */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                E-mail
              </TableCell>
              <TableCell className="text-right font-medium text-sm">
                {props.email || "---"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                CPF
              </TableCell>
              <TableCell className="text-right font-medium text-sm">
                {props.cpf}
              </TableCell>
            </TableRow>

            {/* ENDEREÇO */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Endereço
              </TableCell>
              <TableCell className="text-right font-medium text-sm break-words max-w-[160px]">
                {props.address || "---"}
              </TableCell>
            </TableRow>

            {/* FINANCEIRO */}
            <TableRow className="bg-muted/30">
              <TableCell className="text-muted-foreground text-sm">
                Total Empréstimo
              </TableCell>
              <TableCell className="text-right font-bold text-sm">
                {formatCurrency(props.value)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Juros / Mensal
              </TableCell>
              <TableCell className="text-right text-sm">
                {props.loanInterest}% ({formatCurrency(props.monthlyPaid)})
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Total Pago
              </TableCell>
              <TableCell className="text-right font-medium text-sm text-emerald-600">
                {formatCurrency(props.valuePaid)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Último valor pago
              </TableCell>
              <TableCell className="text-right font-medium text-sm text-emerald-600">
                {formatCurrency(props.lastPaymentAmount)}
              </TableCell>
            </TableRow>

            {/* PARCELAS */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Parcelas (P/T)
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {props.installmentsPaid} de {props.installments}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Em Atraso
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-rose-500">
                {props.lateInstallments}
              </TableCell>
            </TableRow>

            {/* DATAS */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm leading-tight">
                Contratação
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatDate(props.loanDate)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm leading-tight">
                Próx. Vencimento
              </TableCell>
              <TableCell className="text-right text-sm font-bold">
                {formatDate(props.nextPaymentDate)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm leading-tight">
                Último Pagamento
              </TableCell>
              <TableCell className="text-right text-sm font-bold">
                {formatDate(props.lastPaymentDate)}
              </TableCell>
            </TableRow>

            {/* STATUS PAGAMENTO */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Mensalidade Paga?
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={props.monthlyFeePaid}
                      disabled
                      className="h-3 w-3"
                    />
                    <span className="text-[10px]">Sim</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={!props.monthlyFeePaid}
                      disabled
                      className="h-3 w-3"
                    />
                    <span className="text-[10px]">Não</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground text-sm">
                Dívida Quitada?
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={props.totalDebtPaid}
                    disabled
                    className="h-3 w-3"
                  />
                  <span className="text-[10px]">Sim</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={!props.totalDebtPaid}
                    disabled
                    className="h-3 w-3"
                  />
                  <span className="text-[10px]">Não</span>
                </div>
              </TableCell>
            </TableRow>

            {/* OBSERVAÇÕES */}
            <TableRow>
              <TableCell className="text-muted-foreground text-sm pr-0">
                Observações
              </TableCell>
              <TableCell className="text-right font-medium text-[11px] break-words max-w-[160px] py-4 italic">
                {props.observations || "Nenhuma."}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 px-2">
          <div className="mb-2 px-2">
            <h3 className="text-sm font-semibold">Histórico de pagamentos</h3>
            <p className="text-xs text-muted-foreground">
              Últimas datas e valores pagos para este cliente.
            </p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor pago</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPayments ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando histórico...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paymentsError ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-6 text-center text-sm text-rose-500"
                    >
                      {paymentsError}
                    </TableCell>
                  </TableRow>
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-sm">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-emerald-600">
                        {formatCurrency(Number(payment.amount) || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePayment(payment.id)}
                          disabled={deletingPaymentId === payment.id}
                          className="text-rose-500 hover:text-rose-600 h-7 w-7 p-0"
                        >
                          {deletingPaymentId === payment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum pagamento registrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
