import { toast } from "sonner";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/axios";

import { ClientDetailsProps } from "./client-details";

interface UpdateClientDialogProps {
  client: ClientDetailsProps;
}

export function UpdateClientDialog({ client }: UpdateClientDialogProps) {
  const { register, handleSubmit, reset, control, watch, setValue } = useForm();

  const loanValue = watch("value");
  const interestPercentage = watch("loanInterest");

  // Funções Auxiliares de Formatação (Para inicialização)
  const formatToMoney = (v: number | string) => Number(v).toFixed(2);

  const formatCPF = (v: string) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14);
  };

  const formatPhone = (v: string) => {
    return v
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .substring(0, 15);
  };

  // Efeito para carregar os dados do cliente no formulário
  useEffect(() => {
    if (client) {
      reset({
        ...client,
        // Datas formatadas para o input date (YYYY-MM-DD)
        loanDate: client.loanDate
          ? new Date(client.loanDate).toISOString().split("T")[0]
          : "",
        nextPaymentDate: client.nextPaymentDate
          ? new Date(client.nextPaymentDate).toISOString().split("T")[0]
          : "",
        lastPaymentDate: client.lastPaymentDate
          ? new Date(client.lastPaymentDate).toISOString().split("T")[0]
          : "",

        // Booleans para String (necessário para o Select)
        monthlyFeePaid: String(client.monthlyFeePaid),
        totalDebtPaid: String(client.totalDebtPaid),

        // Aplicação de máscaras iniciais
        cpf: formatCPF(client.cpf || ""),
        phone: formatPhone(client.phone || ""),
        value: formatToMoney(client.value),
        monthlyPaid: formatToMoney(client.monthlyPaid),
        valuePaid: formatToMoney(client.valuePaid),
      });
    }
  }, [client, reset]);

  // Lógica de Máscaras idêntica ao Create ------------------------------------
  const handleMoneyMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");
    const result = (Number(value) / 100).toFixed(2);
    setValue(e.currentTarget.name as any, result);
  };

  useEffect(() => {
    if (loanValue && interestPercentage) {
      const monthlyInterest =
        (Number(loanValue) * Number(interestPercentage)) / 100;
      setValue("monthlyPaid", monthlyInterest.toFixed(2));
    }
  }, [loanValue, interestPercentage, setValue]);

  const handleCPFMask = (e: React.FormEvent<HTMLInputElement>) => {
    setValue("cpf", formatCPF(e.currentTarget.value));
  };

  const handlePhoneMask = (e: React.FormEvent<HTMLInputElement>) => {
    setValue("phone", formatPhone(e.currentTarget.value));
  };
  //----------------------------------------------------------------------------

  async function handleUpdateClient(data: any) {
    try {
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, ""),
        value: Number(data.value),
        loanInterest: Number(data.loanInterest),
        installments: parseInt(data.installments) || 0,
        installmentsPaid: parseInt(data.installmentsPaid) || 0,
        lateInstallments: parseInt(data.lateInstallments) || 0,
        valuePaid: Number(data.valuePaid) || 0,
        monthlyPaid: Number(data.monthlyPaid) || 0,
        loanDate: new Date(data.loanDate).toISOString(),
        nextPaymentDate: data.nextPaymentDate
          ? new Date(data.nextPaymentDate).toISOString()
          : null,
        lastPaymentDate: data.lastPaymentDate
          ? new Date(data.lastPaymentDate).toISOString()
          : null,
        monthlyFeePaid: data.monthlyFeePaid === "true",
        totalDebtPaid: data.totalDebtPaid === "true",
      };

      await api.put(`/clients/${client.id}`, formattedData);
      toast.success("Cliente atualizado com sucesso!");
      window.location.reload();
    } catch (error: any) {
      console.error("ERRO:", error.response?.data);
      toast.error("Erro ao atualizar cliente.");
    }
  }

  return (
    <DialogContent className="md:max-w-[500px] w-[95vw] p-0 overflow-hidden flex flex-col md:max-h-[85vh] max-h-[95vh] rounded-lg">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle>Atualizar cliente</DialogTitle>
        <DialogDescription>
          Altere os dados necessários. No mobile os campos empilham, no desktop
          agrupam.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleUpdateClient)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loanDate">Data do Empréstimo</Label>
              <Input
                id="loanDate"
                type="date"
                {...register("loanDate")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                maxLength={14}
                {...register("cpf")}
                onInput={handleCPFMask}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                maxLength={15}
                {...register("phone")}
                onInput={handlePhoneMask}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" {...register("address")} />
            </div>
          </div>

          <hr className="border-muted" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor do Empréstimo (R$)</Label>
              <Input
                id="value"
                type="text"
                placeholder="0,00"
                {...register("value")}
                onInput={handleMoneyMask}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanInterest">Juros (%)</Label>
              <Input
                id="loanInterest"
                type="number"
                step="0.01"
                {...register("loanInterest")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyPaid">Juros Mensal (R$)</Label>
              <Input
                id="monthlyPaid"
                type="text"
                placeholder="00,00"
                {...register("monthlyPaid")}
                onInput={handleMoneyMask}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Total Parcelas</Label>
              <Input
                id="installments"
                type="number"
                {...register("installments")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installmentsPaid">Parcelas Pagas</Label>
              <Input
                id="installmentsPaid"
                type="number"
                {...register("installmentsPaid")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lateInstallments">Parcelas Atrasadas</Label>
              <Input
                id="lateInstallments"
                type="number"
                {...register("lateInstallments")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valuePaid">Valor Total Pago (R$)</Label>
              <Input
                id="valuePaid"
                type="text"
                placeholder="0,00"
                {...register("valuePaid")}
                onInput={handleMoneyMask}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextPaymentDate">Próxima Parcela (Data)</Label>
              <Input
                id="nextPaymentDate"
                type="date"
                {...register("nextPaymentDate")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastPaymentDate">
                Última Parcela Paga (Data)
              </Label>
              <Input
                id="lastPaymentDate"
                type="date"
                {...register("lastPaymentDate")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status Mensalidade</Label>
            <Controller
              name="monthlyFeePaid"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Em Aberto</SelectItem>
                    <SelectItem value="true">Paga</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dívida Quitada?</Label>
              <Controller
                name="totalDebtPaid"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Pendente</SelectItem>
                      <SelectItem value="true">Quitado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Input
              id="observations"
              {...register("observations")}
              placeholder="Notas extras..."
            />
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-muted/20">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Salvar Alterações</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
