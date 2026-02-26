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

export function CreateClientDialog() {
  const { register, handleSubmit, reset, control, watch, setValue } = useForm();
  const loanValue = watch("value");
  const interestPercentage = watch("loanInterest");

  // Aplicação de Máscaras no formulário ------------------------------------
  const handleMoneyMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");

    const result = (Number(value) / 100).toFixed(2);

    const fieldName = e.currentTarget.name;
    setValue(fieldName, result);
  };

  useEffect(() => {
    if (loanValue && interestPercentage) {
      const monthlyInterest =
        (Number(loanValue) * Number(interestPercentage)) / 100;
      setValue("monthlyPaid", monthlyInterest.toFixed(2));
    }
  }, [loanValue, interestPercentage]);

  const handleCPFMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    value = value.replace(/\D/g, "");

    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
    setValue("cpf", value);
  };

  const handlePhoneMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    value = value.replace(/\D/g, "");

    value = value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("phone", value);
  };

  //----------------------------------------------------------------------------

  async function handleCreateClient(data: any) {
    try {
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        value: Number(data.value),
        loanInterest: Number(data.loanInterest),
        installments: parseInt(data.installments) || 0,
        installmentsPaid: parseInt(data.installmentsPaid) || 0,
        lateInstallments: parseInt(data.lateInstallments) || 0,
        valuePaid: Number(data.valuePaid) || 0,
        monthlyPaid: Number(data.monthlyPaid) || 0,
        loanDate: data.loanDate
          ? new Date(data.loanDate).toISOString()
          : new Date().toISOString(),
        nextPaymentDate: data.nextPaymentDate
          ? new Date(data.nextPaymentDate).toISOString()
          : null,
        lastPaymentDate: data.lastPaymentDate
          ? new Date(data.lastPaymentDate).toISOString()
          : null,
        monthlyFeePaid: data.monthlyFeePaid === "true",
        totalDebtPaid: data.totalDebtPaid === "true",
      };

      await api.post("/clients", formattedData);
      toast.success("Cliente cadastrado com sucesso!");
      reset();
      window.location.reload();
    } catch (error: any) {
      console.error("ERRO:", error.response?.data);
      toast.error("Erro ao salvar cliente.");
    }
  }

  return (
    <DialogContent className="md:max-w-[500px] h-[95vh] md:h-[85vh] w-[95vw] p-0 flex flex-col rounded-lg overflow-hidden">
      <DialogHeader className="pt-8 px-6 pb-0">
        <DialogTitle>Novo cliente</DialogTitle>
        <DialogDescription>
          Preencha os dados do novo cliente.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleCreateClient)}
        className=" flex w-full flex-col flex-1 overflow-x-hidden"
      >
        {/* ÁREA DE SCROLL */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin overflow-x-hidden">
          {/* GRUPO 1: Data e Nome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 ">
              <Label htmlFor="loanDate">Data do Empréstimo</Label>
              <Input
                className=" h-10  cursor-pointer w-full"
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

          {/* GRUPO 2: Email e CPF */}
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

          {/* GRUPO 3: Telefone e Endereço */}
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

          {/* GRUPO 4: Financeiro (3 colunas em desktop) */}
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

          {/* GRUPO 5: Parcelas (3 colunas em desktop) */}
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

          {/* GRUPO 6: Pagamentos e Datas */}
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
                className="h-10 w-full cursor-pointer"
                type="date"
                {...register("lastPaymentDate")}
              />
            </div>
          </div>

          {/* GRUPO 7: Selects e Observações */}
          <div className="space-y-2">
            <Label>Status Mensalidade</Label>
            <Controller
              name="monthlyFeePaid"
              control={control}
              defaultValue="false"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="cursor-pointer">
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
                defaultValue="false"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="cursor-pointer">
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
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
