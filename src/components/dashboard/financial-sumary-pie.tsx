"use client";

import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/axios";

export function FinancialSummaryPie({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [data, setData] = useState<{
    totalIn: number;
    totalOut: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await api.get("/dashboard/monthly-summary");
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  const saldoFinal = (data?.totalIn || 0) - (data?.totalOut || 0);
  const isLucro = saldoFinal >= 0;

  const pieChartData = [
    {
      status: "Entradas",
      value: data?.totalIn || 0,
      fill: "var(--color-chart-2)",
    },
    {
      status: "Saídas",
      value: data?.totalOut || 0,
      fill: "var(--color-chart-5)",
    },
  ];

  if (isLoading && !data) {
    return (
      <Card className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Resumo Financeiro (Mês Atual)</CardTitle>
        <CardDescription>Entradas vs Saídas </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex md:pt-15">
        <ChartContainer
          className="mx-auto md:max-h-[250px] aspect-square w-full"
          config={{}}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="status"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          R$ {Math.abs(saldoFinal).toLocaleString("pt-BR")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          {isLucro ? "Saldo Positivo" : "Saldo Negativo"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {isLucro ? "Superávit:" : "Déficit:"}{" "}
          <span
            className={
              isLucro
                ? "dark:text-emerald-400 text-emerald-500"
                : "dark:text-red-400 text-red-500"
            }
          >
            R$ {Math.abs(saldoFinal).toLocaleString("pt-BR")}
          </span>
          {isLucro ? (
            <TrendingUp className="h-4 w-4 dark:text-emerald-400 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 dark:text-red-400 text-red-500" />
          )}
        </div>
        <div className="leading-none text-muted-foreground text-xs text-center">
          Entradas: R$ {data?.totalIn.toLocaleString("pt-BR")} | Saídas: R${" "}
          {data?.totalOut.toLocaleString("pt-BR")}
        </div>
      </CardFooter>
    </Card>
  );
}
