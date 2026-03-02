"use client";

import { Loader2, TrendingUp } from "lucide-react";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/axios";

const pieChartConfig = {
  clients: {
    label: "Clientes",
  },
  pendentes: {
    label: "Pendentes",
    color: "hsl(var(--chart-1))",
  },
  emDia: {
    label: "Em dia",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PieData() {
  const [pieData, setPieData] = React.useState<
    { status: string; value: number; fill: string }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get("/stats/status");
        setPieData(response.data);
      } catch (error) {
        console.error("Erro ao carregar pizza:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalClients = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [pieData]);

  const percentageLate = React.useMemo(() => {
    if (totalClients === 0) return 0;
    const late = pieData.find((d) => d.status === "pendente")?.value || 0;
    return Math.round((late / totalClients) * 100);
  }, [pieData, totalClients]);

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
        <CardTitle>Gráfico de clientes</CardTitle>
        <CardDescription>Em dívida - Em dia</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex md:pt-15">
        <ChartContainer
          config={pieChartConfig}
          className="mx-auto md:max-h-[250px] aspect-square w-full"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClients.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clientes
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
          {percentageLate}% em dívida <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground gap-1 flex items-center flex-col">
          <span className="dark:text-emerald-400 text-emerald-500">
            Em dia:{"  "}
            {pieData
              .find((d) => d.status === "em-dia")
              ?.value.toLocaleString() || 0}
          </span>
          <span className="dark:text-red-400 text-red-500">
            Atrasados:{" "}
            {pieData
              .find((d) => d.status === "pendente")
              ?.value.toLocaleString() || 0}
          </span>
          Mostrando todos os clientes.
        </div>
      </CardFooter>
    </Card>
  );
}
