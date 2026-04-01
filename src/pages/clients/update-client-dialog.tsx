"use-client";

import { toast } from "sonner";

import { useEffect } from "react";
import React from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const lastPaymentBaseRef = useRef(0);

  const loanValue = watch("value");
  const interestPercentage = watch("loanInterest");

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

  // --- MÁSCARAS E GATILHOS ---

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

  // Automação: Pula a próxima data para 1 mês à frente quando altera o Empréstimo
  const handleLoanDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // Vem no formato YYYY-MM-DD
    if (val) {
      const date = new Date(val + "T12:00:00");
      date.setMonth(date.getMonth() + 1);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      setValue("nextPaymentDate", `${year}-${month}-${day}`);
    }
  };

  // --- EFEITOS ---

  // Reset para carregar os dados
  useEffect(() => {
    if (client) {
      const formatToInputDate = (dateISO: string) => {
        if (!dateISO) return "";
        return new Date(dateISO).toISOString().split("T")[0];
      };
      reset({
        ...client,
        loanDate: formatToInputDate(client.loanDate),
        nextPaymentDate: formatToInputDate(client.nextPaymentDate),
        lastPaymentDate: formatToInputDate(client.lastPaymentDate),
        monthlyFeePaid: String(client.monthlyFeePaid),
        totalDebtPaid: String(client.totalDebtPaid),
        isDelinquent: Boolean(client.isDelinquent),
        value: formatToBRL(client.value),
        monthlyPaid: formatToBRL(client.monthlyPaid),
        valuePaid: formatToBRL(client.valuePaid),
        lastPaymentAmount: formatToBRL(client.lastPaymentAmount),
      });
      lastPaymentBaseRef.current = Number(client.valuePaid) || 0;
    }
  }, [client, reset]);

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

  // Zerar mensalidades se mudar para Em Dia
  const currentLateInstallments = watch("lateInstallments");

  // --- LIMPEZA AO FECHAR O MODAL ---
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // --- A REGRA DE OURO DO STATUS ---
  // Este efeito garante que o Status sempre obedeça o número de Atrasadas
  useEffect(() => {
    const atrasadas = Number(currentLateInstallments) || 0;

    if (atrasadas > 0) {
      // Se tem 1 ou mais atrasos, o status TRAVA no Atrasado (false)
      setValue("monthlyFeePaid", "false");
    } else {
      // Se não tem atraso (0), o status TRAVA no Em dia (true)
      setValue("monthlyFeePaid", "true");
    }
  }, [currentLateInstallments, setValue]);

  // Cálculos automáticos de juros

  useEffect(() => {
    if (loanValue && interestPercentage) {
      const val = parseMoney(loanValue);
      const interest = (val * Number(interestPercentage)) / 100;
      setValue("monthlyPaid", formatToBRL(interest));
    }
  }, [loanValue, interestPercentage, setValue]);

  const handleConfirmPayment = (checked: boolean) => {
    if (checked) {
      // 1. Adiciona +1 nas parcelas pagas
      const currentInstallmentsPaid = Number(watch("installmentsPaid")) || 0;
      setValue("installmentsPaid", currentInstallmentsPaid + 1);

      // 2. Reduz 1 parcela atrasada dinamicamente (sem zerar tudo)
      const currentLate = Number(watch("lateInstallments")) || 0;
      const newLate = Math.max(0, currentLate - 1);
      setValue("lateInstallments", newLate);

      // Só fica "Em dia" se o cliente não tiver mais nenhuma parcela atrasada
      if (newLate === 0) {
        setValue("monthlyFeePaid", "true");
      } else {
        setValue("monthlyFeePaid", "false");
      }

      // 3. Atualiza o valor pago (puxa do juros mensal)
      const currentMonthlyPaid = watch("monthlyPaid");
      lastPaymentBaseRef.current = parseMoney(watch("valuePaid"));
      setValue("lastPaymentAmount", currentMonthlyPaid);
      syncTotalReturnedWithLastPayment(currentMonthlyPaid);

      // 4. Última Data Paga = Exatamente HOJE (Data real)
      const today = new Date();
      const todayY = today.getFullYear();
      const todayM = String(today.getMonth() + 1).padStart(2, "0");
      const todayD = String(today.getDate()).padStart(2, "0");
      setValue("lastPaymentDate", `${todayY}-${todayM}-${todayD}`);

      // 5. Próxima Data = incrementa apenas o mês da data de vencimento atual em 1
      const currentNextDate = watch("nextPaymentDate");
      if (currentNextDate) {
        const oldDateObj = new Date(currentNextDate + "T12:00:00");
        oldDateObj.setMonth(oldDateObj.getMonth() + 1);

        const nextY = oldDateObj.getFullYear();
        const nextM = String(oldDateObj.getMonth() + 1).padStart(2, "0");
        const nextD = String(oldDateObj.getDate()).padStart(2, "0");

        setValue("nextPaymentDate", `${nextY}-${nextM}-${nextD}`);
      }

      toast.success("Pagamento registrado e parcelas ajustadas!");
    }
  };

  async function handleUpdateClient(data: any) {
    // 1. Removemos o ID ou qualquer campo de controle extra
    const { confirmPayment, id, ...restOfData } = data;

    try {
      const insertedLastPayment = parseMoney(data.lastPaymentAmount);

      // 2. Formatamos apenas os textos que tem máscara.
      // O resto vai direto, porque o BACKEND agora resolve dinheiro e datas.
      const formattedData = {
        ...restOfData,
        cpf: data.cpf?.replace(/\D/g, ""),
        phone: data.phone?.replace(/\D/g, ""),
        valuePaid: parseMoney(data.valuePaid),
        lastPaymentAmount: insertedLastPayment,
        isDelinquent: Boolean(data.isDelinquent),
        // Inclui confirmPayment: true apenas se o usuário marcou a checkbox
        ...(confirmPayment && { confirmPayment: true }),
      };

      await api.put(`/clients/${client.id}`, formattedData);
      toast.success("Cliente atualizado com sucesso!");
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
        <div className="flex-1 overflow-y-auto oxerflow-x-hidden p-6 space-y-6 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data do Empréstimo</Label>
              {/* O onChange inteligente foi adicionado aqui */}
              <Input
                type="date"
                {...register("loanDate", { onChange: handleLoanDateChange })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...register("name")} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
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
              <Label>Telefone</Label>
              <Input
                inputMode="numeric"
                maxLength={15}
                {...register("phone")}
                onInput={handlePhoneMask}
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input {...register("address")} />
            </div>
          </div>

          <hr className="border-muted" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Valor Empréstimo (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
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
              <Input
                type="number"
                {...register("lateInstallments", {
                  onChange: (e) => {
                    const val = Number(e.target.value) || 0;
                    // Se for maior que 0, trava em Atrasado. Senão, Em dia.
                    if (val > 0) {
                      setValue("monthlyFeePaid", "false");
                    } else {
                      setValue("monthlyFeePaid", "true");
                    }
                  },
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="isDelinquent"
              control={control}
              render={({ field }) => (
                <div className="mb-4 flex items-center space-x-3 bg-rose-500/10 p-4 rounded-lg border border-rose-500/20">
                  <Checkbox
                    id="isDelinquent"
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked: boolean) => {
                      field.onChange(checked);
                    }}
                    className="w-5 h-5 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500 cursor-pointer"
                  />
                  <Label
                    htmlFor="isDelinquent"
                    className="font-semibold text-rose-700 dark:text-rose-400 cursor-pointer"
                  >
                    Cliente inadimplente
                  </Label>
                </div>
              )}
            />

            <Controller
              name="confirmPayment"
              control={control}
              render={({ field }) => (
                <div className=" mb-4 flex items-center space-x-3 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                  <Checkbox
                    id="confirmPayment"
                    checked={field.value}
                    onCheckedChange={(checked: boolean) => {
                      // 1. Atualiza o estado interno do React Hook Form
                      field.onChange(checked);

                      // 2. Dispara a sua função de automação
                      handleConfirmPayment(checked);
                    }}
                    className="w-5 h-5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 cursor-pointer"
                  />
                  <Label
                    htmlFor="confirmPayment"
                    className="font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer "
                  >
                    Resgistrar pagamento de mensalidade
                  </Label>
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Último Valor Pago (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
                onFocus={() => {
                  lastPaymentBaseRef.current = parseMoney(watch("valuePaid"));
                }}
                {...register("lastPaymentAmount", {
                  onChange: handleLastPaymentAmountChange,
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Retornado (R$)</Label>
              <Input
                type="text"
                inputMode="numeric"
                {...register("valuePaid", { onChange: handleMoneyMask })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Próx. Mensalidade</Label>
              <Input type="date" {...register("nextPaymentDate")} required />
            </div>
            <div className="space-y-2">
              <Label>Última Data Paga</Label>
              <Input type="date" {...register("lastPaymentDate")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2 ">
              <Label>Status Mensalidade</Label>
              <Controller
                name="monthlyFeePaid"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      if (value === "true") {
                        // Se mudou para Em Dia, zera as parcelas
                        setValue("lateInstallments", 0);
                        toast.info("Mensalidades atrasadas zeradas.");
                      } else if (value === "false") {
                        // Se mudou para Atrasada, garante que tenha pelo menos 1 atraso
                        const currentLate =
                          Number(watch("lateInstallments")) || 0;
                        if (currentLate === 0) {
                          setValue("lateInstallments", 1);
                        }
                      }
                    }}
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
            <div className="space-y-2 ">
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
            <Label>Observações</Label>
            <Input
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
          <Button type="submit">Salvar Alterações</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
