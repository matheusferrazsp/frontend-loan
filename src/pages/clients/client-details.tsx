import { FileDown, Loader2, MessageCircle, Trash2 } from "lucide-react";
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
import { printHtml } from "@/lib/printHtml";

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
  isDelinquent: boolean;
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

  const getStatusDisplay = () => {
    if (props.isDelinquent) return { text: "Inadimplente", htmlClass: "badge-err", dot: "bg-rose-500", textClass: "text-rose-500" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = props.nextPaymentDate ? new Date(props.nextPaymentDate) : null;

    if (dueDate) {
      const dueDateZero = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
      if (dueDateZero.getTime() === today.getTime()) return { text: "Vence hoje", htmlClass: "badge-ok", dot: "bg-amber-500", textClass: "text-amber-500" };
      if (dueDateZero < today || props.lateInstallments > 0) return { text: "Atrasado", htmlClass: "badge-err", dot: "bg-rose-500", textClass: "text-rose-500" };
    }
    return { text: "Em dia", htmlClass: "badge-ok", dot: "bg-emerald-500", textClass: "text-emerald-500" };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const whatsappNumber = props.phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/55${whatsappNumber}`;

  function printClientDetails() {
    const paymentsRows = payments
      .map(
        (p) => `
        <tr>
          <td>${formatDate(p.date)}</td>
          <td style="text-align:right;color:#16a34a;font-weight:600">${formatCurrency(Number(p.amount) || 0)}</td>
          <td style="color:#6b7280;font-size:11px">${p.note ?? "\u2014"}</td>
        </tr>`,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Ficha \u2013 ${props.name}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
          .section-title { font-size: 13px; font-weight: 700; margin: 20px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; }
          td, th { padding: 7px 10px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
          th { text-align: left; color: #6b7280; font-weight: 600; font-size: 11px; background: #f9fafb; }
          .label { color: #6b7280; width: 45%; }
          .value { font-weight: 500; text-align: right; }
          .badge-ok { color: #16a34a; font-weight: 700; }
          .badge-err { color: #dc2626; font-weight: 700; }
          .footer { margin-top: 32px; font-size: 10px; color: #9ca3af; text-align: right; }
        </style>
      </head>
      <body>
        <h1>Ficha do Cliente: ${props.name}</h1>
        <p class="subtitle">Detalhes financeiros e cadastrais \u00b7 Gerado em ${new Date().toLocaleString("pt-BR")}</p>

        <p class="section-title">Dados Pessoais</p>
        <table>
          <tr><td class="label">Status</td><td class="value ${status.htmlClass}">${status.text}</td></tr>
          <tr><td class="label">Nome</td><td class="value">${props.name}</td></tr>
          <tr><td class="label">Telefone</td><td class="value">${formatPhoneDisplay(props.phone)}</td></tr>
          <tr><td class="label">E-mail</td><td class="value">${props.email || "---"}</td></tr>
          <tr><td class="label">CPF</td><td class="value">${props.cpf || "---"}</td></tr>
          <tr><td class="label">Endere\u00e7o</td><td class="value">${props.address || "---"}</td></tr>
        </table>

        <p class="section-title">Financeiro</p>
        <table>
          <tr><td class="label">Total do Empr\u00e9stimo</td><td class="value">${formatCurrency(props.value)}</td></tr>
          <tr><td class="label">Juros / Mensalidade</td><td class="value">${props.loanInterest}% (${formatCurrency(props.monthlyPaid)})</td></tr>
          <tr><td class="label">Total Pago</td><td class="value badge-ok">${formatCurrency(props.valuePaid)}</td></tr>
          <tr><td class="label">\u00daltimo Valor Pago</td><td class="value badge-ok">${formatCurrency(props.lastPaymentAmount)}</td></tr>
        </table>

        <p class="section-title">Parcelas</p>
        <table>
          <tr><td class="label">Pagas / Total</td><td class="value">${props.installmentsPaid} de ${props.installments}</td></tr>
          <tr><td class="label">Em Atraso</td><td class="value ${props.lateInstallments > 0 ? "badge-err" : ""}">${props.lateInstallments}</td></tr>
          <tr><td class="label">Mensalidade Paga?</td><td class="value">${props.monthlyFeePaid ? "Sim" : "N\u00e3o"}</td></tr>
          <tr><td class="label">D\u00edvida Quitada?</td><td class="value">${props.totalDebtPaid ? "Sim" : "N\u00e3o"}</td></tr>
        </table>

        <p class="section-title">Datas</p>
        <table>
          <tr><td class="label">Contrata\u00e7\u00e3o</td><td class="value">${formatDate(props.loanDate)}</td></tr>
          <tr><td class="label">Pr\u00f3x. Vencimento</td><td class="value">${formatDate(props.nextPaymentDate)}</td></tr>
          <tr><td class="label">\u00daltimo Pagamento</td><td class="value">${formatDate(props.lastPaymentDate)}</td></tr>
        </table>

        ${
          props.observations
            ? `
        <p class="section-title">Observa\u00e7\u00f5es</p>
        <p style="font-size:12px;color:#374151;font-style:italic;padding:8px 10px">${props.observations}</p>
        `
            : ""
        }

        <p class="section-title">Hist\u00f3rico de Pagamentos</p>
        ${
          payments.length > 0
            ? `
        <table>
          <thead><tr><th>Data</th><th style="text-align:right">Valor Pago</th><th>Observa\u00e7\u00e3o</th></tr></thead>
          <tbody>${paymentsRows}</tbody>
        </table>
        `
            : `<p style="font-size:12px;color:#6b7280;padding:8px 10px">Nenhum pagamento registrado.</p>`
        }

        <p class="footer">VeroFlux \u00b7 ${window.location.hostname}</p>
      </body>
      </html>`;

    printHtml(html);
  }

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
    <DialogContent className="sm:w-[70vw] w-[95vw] md:w-[50vw] md:h-[95vh] h-[85vh] p-0 flex flex-col rounded-lg overflow-x-hidden">
      <DialogHeader className="pt-8 px-6 pb-2">
        <div className="flex items-start justify-between pr-6">
          <div className="flex flex-col gap-1.5 text-left">
            <DialogTitle className="break-all text-lg">
              Cliente: {props.name}
            </DialogTitle>
            <DialogDescription>
              Detalhes financeiros e cadastrais
            </DialogDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={printClientDetails}
            className="print:hidden shrink-0"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Salvar PDF
          </Button>
        </div>
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
                  <span className={`h-2 w-2 rounded-full ${getStatusDisplay().dot}`} />
                  <span className={`font-medium text-sm ${getStatusDisplay().textClass}`}>
                    {getStatusDisplay().text}
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
                    className="bg-emerald-600 h-7 px-2 text-[10px] gap-1 print:hidden"
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
                  <TableHead className="w-[60px] print:hidden"></TableHead>
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
                      <TableCell className="text-right print:hidden">
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
