"use client";

import { Loader2, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { useCallback, useEffect, useMemo, useState } from "react";

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

// Configuração de cores e labels para o gráfico
const pieChartConfig = {
  clients: {
    label: "Clientes",
  },
  pendente: {
    label: "Pendentes",
    color: "hsl(var(--chart-1))",
  },
  "em-dia": {
    label: "Em dia",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartData {
  status: string;
  value: number;
}

export function PieData({ refreshTrigger }: { refreshTrigger?: number }) {
  const [rawApiData, setRawApiData] = useState<ChartData[]>([]);
  const [renderData, setRenderData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setRenderData([]);

      const response = await api.get("/stats/status");
      setRawApiData(response.data);

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  useEffect(() => {
    if (!isLoading && rawApiData.length > 0) {
      const timer = setTimeout(() => {
        setRenderData(rawApiData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, rawApiData]);

  const totalClients = useMemo(() => {
    return renderData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
  }, [renderData]);

  const percentageLate = useMemo(() => {
    if (totalClients === 0) return 0;
    const late =
      renderData.find((d) => d.status.toLowerCase().includes("pendente"))
        ?.value || 0;
    return Math.round((Number(late) / totalClients) * 100);
  }, [renderData, totalClients]);

  if (isLoading) {
    return (
      <Card className="flex h-[400px] items-center justify-center">
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
              data={renderData}
              dataKey="value"
              nameKey="status"
              innerRadius={70}
              strokeWidth={5}
              isAnimationActive={true}
              animationBegin={50}
              animationDuration={1500}
              animationEasing="ease-out"
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
                          Clientes Ativos
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
          {percentageLate}% em dívida{" "}
          <TrendingUp className="h-4 w-4 text-rose-500" />
        </div>
        <div className="text-muted-foreground gap-1 flex items-center flex-col">
          <span className="dark:text-emerald-400 text-emerald-600 font-semibold">
            Em dia:{" "}
            {(
              renderData.find((d) => d.status.toLowerCase() === "em-dia")
                ?.value || 0
            ).toLocaleString()}
          </span>
          <span className="dark:text-rose-400 text-rose-600 font-semibold">
            Atrasados:{" "}
            {(
              renderData.find((d) =>
                d.status.toLowerCase().includes("atrasado"),
              )?.value || 0
            ).toLocaleString()}
          </span>
          <p className="text-xs pt-2">Mostrando todos os clientes ativos.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
