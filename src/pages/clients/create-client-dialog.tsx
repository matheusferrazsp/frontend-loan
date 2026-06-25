"use-client";

import {
  AlertTriangle,
  AlignLeft,
  Calendar,
  CheckCircle2,
  CheckSquare,
  CreditCard,
  DollarSign,
  Hash,
  Mail,
  MapPin,
  Percent,
  Phone,
  User,
} from "lucide-react";
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
  onSuccess?: () => void;
}

export function CreateClientDialog({ onSuccess }: CreateClientDialogProps) {
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
      onSuccess?.();
    } catch (error: any) {
      console.error("ERRO:", error.response?.data);
      toast.error("Erro ao salvar cliente.");
    }
  }

  return (
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="md:max-w-[500px] h-[80vh] md:h-[98vh] w-[95vw] p-0 flex flex-col rounded-lg overflow-hidden"
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
            <div className="space-y-2 overflow-x-hidden rounded-md">
              <Label>Data do Empréstimo</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer z-20 pointer-events-auto"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) as HTMLInputElement;
                    if (input && typeof input.showPicker === "function") {
                      try {
                        input.showPicker();
                      } catch (err) {}
                    }
                  }}
                />
                <Input
                  className="pl-9 custom-date-input"
                  type="date"
                  {...register("loanDate")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-9"
                  {...register("name")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  inputMode="numeric"
                  maxLength={14}
                  className="pl-9"
                  {...register("cpf")}
                  onInput={handleCPFMask}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  inputMode="numeric"
                  maxLength={15}
                  className="pl-9"
                  {...register("phone")}
                  onInput={handlePhoneMask}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="address" className="pl-9" {...register("address")} />
              </div>
            </div>
          </div>

          <hr className="border-muted" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Valor Empréstimo (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  className="pl-9"
                  {...register("value", { onChange: handleMoneyMask })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Juros (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  className="pl-9"
                  {...register("loanInterest")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Juros Mensal (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  className="pl-9"
                  {...register("monthlyPaid", { onChange: handleMoneyMask })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Parcelas</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-9"
                  {...register("installments")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensalidades Pagas</Label>
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-9"
                  {...register("installmentsPaid")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensalidades Atrasadas</Label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-9"
                  {...register("lateInstallments")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Retornado (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  className="pl-9"
                  {...register("valuePaid", { onChange: handleMoneyMask })}
                />
              </div>
            </div>
            <div className="space-y-2 overflow-x-hidden rounded-md">
              <Label>Próx. Mensalidade</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer z-20 pointer-events-auto"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) as HTMLInputElement;
                    if (input && typeof input.showPicker === "function") {
                      try {
                        input.showPicker();
                      } catch (err) {}
                    }
                  }}
                />
                <Input
                  type="date"
                  className="pl-9 custom-date-input"
                  {...register("nextPaymentDate")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 overflow-x-hidden rounded-md">
              <Label>Última Data de Pagamento</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer z-20 pointer-events-auto"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) as HTMLInputElement;
                    if (input && typeof input.showPicker === "function") {
                      try {
                        input.showPicker();
                      } catch (err) {}
                    }
                  }}
                />
                <Input
                  type="date"
                  className="pl-9 custom-date-input"
                  {...register("lastPaymentDate")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Último Valor Pago (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  className="pl-9"
                  {...register("lastPaymentAmount", {
                    onChange: handleLastPaymentAmountChange,
                  })}
                  onFocus={() => {
                    lastPaymentBaseRef.current = parseMoney(watch("valuePaid"));
                  }}
                />
              </div>
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
                      className={`pl-9 relative ${
                        field.value === false || field.value === "false"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {field.value === false || field.value === "false" ? (
                        <AlertTriangle className="absolute left-3 top-2.5 h-4 w-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                      )}
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
                    <SelectTrigger className="pl-9 relative">
                      {field.value === true || field.value === "true" ? (
                        <CheckCircle2 className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      )}
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
            <div className="relative">
              <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="observations"
                className="pl-9"
                {...register("observations")}
                placeholder="Notas extras..."
              />
            </div>
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
