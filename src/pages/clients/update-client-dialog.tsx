"use-client";

import { toast } from "sonner";

import { useEffect } from "react";
import React from "react";
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
  const installmentsPaid = watch("installmentsPaid");
  const monthlyPaid = watch("monthlyPaid");

  // --- FUNÇÕES DE UTILIDADE ---

  const formatToBRL = (value: any) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const parseMoney = (val: any) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const cleanValue = val.replace(/\./g, "").replace(",", ".");
    return Number(cleanValue) || 0;
  };

  // --- MÁSCARAS ---

  const handleMoneyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cleanValue = value.replace(/\D/g, "");
    const numericValue = Number(cleanValue) / 100;

    e.target.value = formatToBRL(numericValue);
    setValue(name, e.target.value);
  };

  const handleCPFMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14);
    setValue("cpf", value);
  };

  const handlePhoneMask = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");
    value = value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .substring(0, 15);
    setValue("phone", value);
  };

  // --- EFEITOS DE CÁLCULO ---

  useEffect(() => {
    if (installmentsPaid > 0 && monthlyPaid) {
      const val = parseMoney(monthlyPaid);
      const total = (Number(installmentsPaid) * val).toFixed(2);
      setValue("valuePaid", formatToBRL(total));
    }
  }, [installmentsPaid, monthlyPaid, setValue]);

  useEffect(() => {
    if (loanValue && interestPercentage) {
      const val = parseMoney(loanValue);
      const monthlyInterest = (val * Number(interestPercentage)) / 100;
      setValue("monthlyPaid", formatToBRL(monthlyInterest.toFixed(2)));
    }
  }, [loanValue, interestPercentage, setValue]);

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

        // Booleans para String (Select)
        monthlyFeePaid: String(client.monthlyFeePaid),
        totalDebtPaid: String(client.totalDebtPaid),

        // Aplicação de máscaras iniciais
        value: formatToBRL(client.value),
        monthlyPaid: formatToBRL(client.monthlyPaid),
        valuePaid: formatToBRL(client.valuePaid),
        lastPaymentAmount: formatToBRL(client.lastPaymentAmount),
      });
    }
  }, [client, reset]);

  // --- ENVIO ---

  async function handleUpdateClient(data: any) {
    try {
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, ""),
        value: parseMoney(data.value),
        loanInterest: Number(data.loanInterest),
        installments: parseInt(data.installments) || 0,
        installmentsPaid: parseInt(data.installmentsPaid) || 0,
        lateInstallments: parseInt(data.lateInstallments) || 0,
        valuePaid: parseMoney(data.valuePaid),
        monthlyPaid: parseMoney(data.monthlyPaid),
        lastPaymentAmount: parseMoney(data.lastPaymentAmount),
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
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="md:max-w-[500px] h-[80vh] md:h-[85vh] w-[95vw] p-0 flex flex-col rounded-lg overflow-hidden"
    >
      <DialogHeader className="pt-10 px-6 pb-0">
        <DialogTitle>Atualizar empréstimo</DialogTitle>
        <DialogDescription>Altere os dados necessários.</DialogDescription>
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
                className="h-10 w-full px-3 py-0 leading-none appearance-none flex items-center cursor-pointer"
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
                inputMode="numeric"
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
                inputMode="numeric"
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
              <Label htmlFor="value">Valor Empréstimo (R$)</Label>
              <Input
                id="value"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("value", { onChange: handleMoneyMask })}
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
                inputMode="numeric"
                placeholder="0,00"
                {...register("monthlyPaid", { onChange: handleMoneyMask })}
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
              <Label htmlFor="installmentsPaid">Pagas</Label>
              <Input
                id="installmentsPaid"
                type="number"
                {...register("installmentsPaid")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lateInstallments">Atrasadas</Label>
              <Input
                id="lateInstallments"
                type="number"
                {...register("lateInstallments")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valuePaid">Total Retornado (R$)</Label>
              <Input
                id="valuePaid"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("valuePaid", { onChange: handleMoneyMask })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextPaymentDate">Próx. Mensalidade</Label>
              <Input
                id="nextPaymentDate"
                type="date"
                className="h-10 w-full px-3 py-0 leading-none appearance-none flex items-center cursor-pointer"
                {...register("nextPaymentDate")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastPaymentDate">Última Paga</Label>
              <Input
                id="lastPaymentDate"
                type="date"
                className="h-10 w-full px-3 py-0 leading-none appearance-none flex items-center cursor-pointer"
                {...register("lastPaymentDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastPaymentAmount">Último Valor Pago (R$)</Label>
              <Input
                id="lastPaymentAmount"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("lastPaymentAmount", {
                  onChange: handleMoneyMask,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status Mensalidade</Label>
              <Controller
                name="monthlyFeePaid"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <SelectTrigger
                      className={
                        field.value === false || field.value === "false"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Atrasada</SelectItem>
                      <SelectItem value="true">Em dia</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Dívida Quitada?</Label>
              <Controller
                name="totalDebtPaid"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
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
