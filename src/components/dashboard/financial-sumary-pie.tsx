"use client";

import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import * as React from "react";

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

import { Dashboard } from "./../../pages/app/dashboard";

export function FinancialSummaryPie() {
  const [data, setData] = React.useState<{
    totalIn: number;
    totalOut: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await api.get("/dashboard/monthly-summary");
        // O Prisma aggregate retorna os dados dentro de _sum
        const { _sum } = response.data;

        setData({
          totalIn: Number(_sum.valuePaid) || 0, // Entradas (O que já te pagaram)
          totalOut: Number(_sum.value) || 0, // Saídas (O que você emprestou)
        });
      } catch (error) {
        console.error("Erro ao buscar resumo financeiro:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSummary();
  }, []);

  // Lógica de cálculo baseada nos dados do banco
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

  if (isLoading) {
    return (
      <Card className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Resumo Financeiro</CardTitle>
        <CardDescription>Entradas vs Empréstimos (Mês Atual)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex md:pt-15">
        <ChartContainer className="mx-auto aspect-square w-full" config={{}}>
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
          {isLucro ? "Recuperado:" : "Déficit:"}{" "}
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
