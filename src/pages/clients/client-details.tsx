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
  // Formata números para Moeda Brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formata o telefone para exibição
  const formatPhoneDisplay = (v: string) => {
    if (!v) return "---";
    const cleaned = v.replace(/\D/g, "");
    return cleaned
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  // Formata datas ignorando fuso horário local
  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const whatsappNumber = props.phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/55${whatsappNumber}`;

  return (
    <DialogContent className="md:max-w-[500px] h-[80vh] w-[100vw] p-0 overflow-x-hidden flex flex-col md:max-h-[85vh] max-h-[95vh] rounded-lg">
      <DialogHeader className="pt-10 pb-0">
        <DialogTitle className="break-all">Cliente: {props.name}</DialogTitle>
        <DialogDescription>Detalhes financeiros e cadastrais</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin overflow-x-hidden">
        <Table>
          <TableBody>
            {/* STATUS VISUAL */}
            <TableRow>
              <TableCell className="text-muted-foreground">
                Status do Empréstimo
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${props.lateInstallments > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                  />
                  <span className="font-medium">
                    {props.lateInstallments > 0 ? "Atrasado" : "Em dia"}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Nome Completo
              </TableCell>
              <TableCell className="text-right font-medium">
                {props.name}
              </TableCell>
            </TableRow>

            {/* CONTATO E WHATSAPP */}
            <TableRow>
              <TableCell className="text-muted-foreground">Telefone</TableCell>
              <TableCell className="flex flex-col items-end gap-2">
                <span className="font-medium">
                  {formatPhoneDisplay(props.phone)}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-8"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">E-mail</TableCell>
              <TableCell className="text-right font-medium break-all">
                {props.email || "---"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">CPF</TableCell>
              <TableCell className="text-right font-medium">
                {props.cpf}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Endereço</TableCell>
              <TableCell className="text-right font-medium max-w-[250px] break-words">
                {props.address || "---"}
              </TableCell>
            </TableRow>

            {/* VALORES FORMATADOS COMO DINHEIRO (R$) */}
            <TableRow className="bg-muted/30">
              <TableCell className="text-muted-foreground">
                Valor Total Empréstimo
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(props.value)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Taxa de Juros
              </TableCell>
              <TableCell className="text-right font-medium">
                {props.loanInterest}%
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Valor Mensal (Juros)
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(props.monthlyPaid)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Total Pago até o momento
              </TableCell>
              <TableCell className="text-right font-medium text-emerald-600">
                {formatCurrency(props.valuePaid)}
              </TableCell>
            </TableRow>

            {/* PARCELAS E DATAS */}
            <TableRow>
              <TableCell className="text-muted-foreground">
                Parcelas (Pagas / Total)
              </TableCell>
              <TableCell className="text-right font-medium">
                {props.installmentsPaid} de {props.installments}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Parcelas em Atraso
              </TableCell>
              <TableCell className="text-right font-medium text-rose-500">
                {props.lateInstallments}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Data da Contratação
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatDate(props.loanDate)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Vencimento Próxima Parcela
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatDate(props.nextPaymentDate)}
              </TableCell>
            </TableRow>

            {/* STATUS DE PAGAMENTO */}
            <TableRow>
              <TableCell className="text-muted-foreground">
                Mensalidade deste mês paga?
              </TableCell>
              <TableCell className="flex justify-end gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={props.monthlyFeePaid} disabled />
                  <span className="text-sm">Sim</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={!props.monthlyFeePaid} disabled />
                  <span className="text-sm">Não</span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Dívida Total Quitada?
              </TableCell>
              <TableCell className="flex justify-end gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={props.totalDebtPaid} disabled />
                  <span className="text-sm">Sim</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={!props.totalDebtPaid} disabled />
                  <span className="text-sm">Não</span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Observações
              </TableCell>
              <TableCell className="text-right font-medium max-w-[300px] break-words py-4 italic">
                {props.observations || "Nenhuma observação."}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
