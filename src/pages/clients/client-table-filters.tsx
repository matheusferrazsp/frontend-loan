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
}

export function ClientTableFilters({ onFilter }: FilterProps) {
  const { register, control, watch, reset } = useForm<FilterData>({
    defaultValues: {
      name: "",
      date: "",
      status: "all",
    },
  });

  // "Assiste" todos os campos em tempo real
  const filters = watch();

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

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
          placeholder="Nome do cliente"
          className="order-1 text-xs md:w-[320px] w-[150px]"
        />
        <Input
          {...register("date")}
          placeholder="Data de pagamento"
          type="text"
          onFocus={(e) => {
            e.target.type = "date";
            // Tenta abrir o calendário nativo automaticamente
            try {
              e.target.showPicker();
            } catch (error) {
              console.log("showPicker não suportado ou bloqueado");
            }
          }}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          className="order-3 text-xs md:w-[150px] w-[150px]"
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="order-3 md:order-3 text-xs md:w-[150px] w-100%">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="all">
                  Todos
                </SelectItem>
                <SelectItem className="text-xs" value="debtor">
                  Atrasado
                </SelectItem>
                <SelectItem className="text-xs" value="paid">
                  Em dia
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Button
          onClick={() => reset()}
          className="font-normal  order-4 items-center w-100%"
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
