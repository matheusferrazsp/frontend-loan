import { X } from "lucide-react";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  onFilter: (data: FilterData) => void;
}

export interface FilterData {
  name: string;
  date: string;
  status: string;
  debtStatus: string;
}

export function ClientTableFilters({ onFilter }: FilterProps) {
  const { register, control, watch, reset, getValues } = useForm<FilterData>({
    defaultValues: {
      name: "",
      date: "",
      status: "all",
      debtStatus: "pending",
    },
  });

  // "Assiste" todos os campos em tempo real

  useEffect(() => {
    onFilter(getValues());
  }, [getValues, onFilter]);

  useEffect(() => {
    const subscription = watch((value) => {
      onFilter(value as FilterData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFilter]);

  return (
    <>
      <div className="flex items-center pb-2">
        <span className="text-sm font-semibold">Buscar Cliente:</span>
      </div>

      <form
        className="flex flex-wrap gap-2 md:gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          {...register("name")}
          placeholder="Nome "
          className="order-1 text-xs md:w-[320px] w-[150px]"
        />
        <Input
          {...register("date")}
          type="date"
          className="order-3 text-xs md:w-[150px] w-[150px]"
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="order-3 md:order-3 text-xs md:w-[150px] w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="all">
                  Todos
                </SelectItem>
                <SelectItem className="text-xs" value="debtor">
                  Atrasado
                </SelectItem>
                <SelectItem className="text-xs" value="due">
                  Vence Hoje
                </SelectItem>
                <SelectItem className="text-xs" value="paid">
                  Em dia
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="debtStatus"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="order-3 md:order-3 text-xs md:w-[150px] w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="pending">
                  Dívida Pendente
                </SelectItem>
                <SelectItem className="text-xs" value="paid">
                  Dívida Quitada
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Button
          onClick={() => reset()}
          className="font-normal text-xs justify-start order-4 e w-[150px]"
          variant="outline"
          type="button"
        >
          <X className="h-4 w-4 " />
          Remover filtros
        </Button>
      </form>
    </>
  );
}
