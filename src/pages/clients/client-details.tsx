import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
  monthlyPaid: number;
  loanDate: string;
  nextPaymentDate: string;
  lastPaymentDate: string;
  monthlyFeePaid: boolean;
  totalDebtPaid: boolean;
  observations: string;
}

export function ClientDetails(props: ClientDetailsProps) {
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
      </div>
    </DialogContent>
  );
}
