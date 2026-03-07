"use-client";

import { toast } from "sonner";

import { useEffect } from "react";
import React from "react";
import { useRef } from "react";
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

interface CreateClientDialogProps {
  client?: any;
}

export function CreateClientDialog({}: CreateClientDialogProps) {
  const { register, handleSubmit, control, watch, setValue, reset } = useForm();
  const lastPaymentBaseRef = useRef(0);

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
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .substring(0, 15);
    setValue("phone", value);
  };

  // --- EFEITOS DE CÁLCULO ---

  const syncTotalReturnedWithLastPayment = (lastPaymentValue: any) => {
    const lastPayment = parseMoney(lastPaymentValue);
    const updatedTotal = lastPaymentBaseRef.current + lastPayment;
    setValue("valuePaid", formatToBRL(updatedTotal));
  };

  const handleLastPaymentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleMoneyMask(e);
    syncTotalReturnedWithLastPayment(e.target.value);
  };

  useEffect(() => {
    if (installmentsPaid > 0 && monthlyPaid) {
      const val = parseMoney(monthlyPaid);
      setValue("valuePaid", formatToBRL(Number(installmentsPaid) * val));
    }
  }, [installmentsPaid, monthlyPaid, setValue]);

  useEffect(() => {
    if (loanValue && interestPercentage) {
      const val = parseMoney(loanValue);
      const monthlyInterest = (val * Number(interestPercentage)) / 100;
      setValue("monthlyPaid", formatToBRL(monthlyInterest.toFixed(2)));
    }
  }, [loanValue, interestPercentage, setValue]);

  // --- EFEITO PARA DATA DE PAGAMENTO AUTOMÁTICA ---
  const loanDateValue = watch("loanDate");
  useEffect(() => {
    if (loanDateValue) {
      const date = new Date(loanDateValue + "T12:00:00");

      if (!isNaN(date.getTime())) {
        // Adicionamos 1 mês
        date.setMonth(date.getMonth() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const nextMonthDate = `${year}-${month}-${day}`;

        setValue("nextPaymentDate", nextMonthDate);
      }
    }
  }, [loanDateValue, setValue]);

  // --- LIMPEZA AO FECHAR O MODAL ---
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  async function handleCreateClient(data: any) {
    try {
      const formattedData = {
        ...data,
        cpf: data.cpf?.replace(/\D/g, ""),
        phone: data.phone?.replace(/\D/g, ""),
        value: parseMoney(data.value),
        loanInterest: Number(data.loanInterest),
        installments: parseInt(data.installments) || 0,
        installmentsPaid: parseInt(data.installmentsPaid) || 0,
        lateInstallments: parseInt(data.lateInstallments) || 0,
        valuePaid: parseMoney(data.valuePaid),
        monthlyPaid: parseMoney(data.monthlyPaid),
        lastPaymentAmount: parseMoney(data.lastPaymentAmount),
        loanDate: data.loanDate,
        nextPaymentDate: data.nextPaymentDate,
        lastPaymentDate: data.lastPaymentDate,
      };

      await api.post("/clients", formattedData);
      toast.success("Cliente cadastrado com sucesso!");
      reset();
    } catch (error: any) {
      console.error("ERRO:", error.response?.data);
      toast.error("Erro ao salvar cliente.");
    }
  }

  return (
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="md:max-w-[500px] h-[80vh] md:h-[85vh] w-[95vw] p-0 flex flex-col rounded-lg overflow-hidden"
    >
      <DialogHeader className="pt-10 px-6 pb-0">
        <DialogTitle>Novo Empréstimo</DialogTitle>
        <DialogDescription>
          Preencha os dados do Empréstimo abaixo.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleCreateClient)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data do Empréstimo</Label>
              <Input
                className=" w-full overflow-x-hidden"
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
                inputMode="numeric"
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
              <Label>Valor Empréstimo (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("value", { onChange: handleMoneyMask })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Juros (%)</Label>
              <Input
                type="number"
                step="0.01"
                {...register("loanInterest")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Juros Mensal (R$)</Label>
              <Input
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
              <Label>Total Parcelas</Label>
              <Input type="number" {...register("installments")} />
            </div>
            <div className="space-y-2">
              <Label>Pagas</Label>
              <Input type="number" {...register("installmentsPaid")} />
            </div>
            <div className="space-y-2">
              <Label>Atrasadas</Label>
              <Input type="number" {...register("lateInstallments")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Retornado (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("valuePaid", { onChange: handleMoneyMask })}
              />
            </div>
            <div className="space-y-2">
              <Label>Próx. Mensalidade</Label>
              <Input type="date" {...register("nextPaymentDate")} required />
            </div>
            <div className="space-y-2">
              <Label>Última Data Paga</Label>
              <Input type="date" {...register("lastPaymentDate")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Último Valor Pago (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                {...register("lastPaymentAmount", {
                  onChange: handleLastPaymentAmountChange,
                })}
                onFocus={() => {
                  lastPaymentBaseRef.current = parseMoney(watch("valuePaid"));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Status Mensalidade</Label>
              <Controller
                name="monthlyFeePaid"
                control={control}
                defaultValue="true"
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
                defaultValue="false"
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
            <Button type="button" variant="ghost" onClick={() => reset()}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
