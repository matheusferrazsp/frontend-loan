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
  return (
    <DialogContent className="w-[90vw] md:w-[50vw] h-[90vh] ">
      <DialogHeader>
        <DialogTitle>Cliente: {props.id}</DialogTitle>
        <DialogDescription>Detalhes do cliente</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 overflow-x-auto">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span className="font-medium ">Atrasado</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground ">Nome</TableCell>
              <TableCell className="flex justify-end ">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">Daiane</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">E-mail</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">daiane@gmail.com</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">CPF</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">135.123.456-78</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Telefone</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">(11) 91234-5678</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground ">Endereço</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium word-wrap whitespace-normal break-words text-right">
                    Rua das Flores, 123, São Paulo, SP
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Valor</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">R$ 10.000,00</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Juros</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">20%</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Parcelas</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">10</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Parcelas pagas
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">5</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Parcelas Atrasadas
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">2</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Total pago
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">R$ 5.000,00</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Valor mensal
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">R$ 1.000,00</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Data do empréstimo
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">01/01/2023</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Mensalidade paga
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">
                    <Checkbox className="mr-5" disabled>
                      Sim
                    </Checkbox>
                    <Checkbox className="" disabled>
                      Não
                    </Checkbox>
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Dívida total paga
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium ">
                    <Checkbox className="mr-5" disabled>
                      Sim
                    </Checkbox>
                    <Checkbox disabled>Não</Checkbox>
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Observações
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-normal break-words text-right">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil labore hic, libero velit iusto enim quisquam fuga
                    inventore ipsam aliquid ipsa, dicta quos. Repellat laborum
                    facere molestiae laudantium! Aut, excepturi?
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
