import { Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/axios";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const chartConfig = {
  entry: {
    label: "Entrada",
  },
  exit: {
    label: "Saída",
  },
} satisfies ChartConfig;

interface ChartDataItem {
  month: string;
  entry: number;
  exit: number;
}

export function AnnualChart({ refreshTrigger }: { refreshTrigger?: number }) {
  const [rawChartData, setRawChartData] = useState<ChartDataItem[]>([]);
  const [renderChartData, setRenderChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setRawChartData([]);
      const response = await api.get("/dashboard/annual-stats");
      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0) {
        setRawChartData(data);
      } else {
        console.warn("Dados inválidos recebidos para annual-chart:", data);
        setRawChartData([]);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Erro ao carregar gráfico anual:", error);
      setRawChartData([]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  useEffect(() => {
    if (!isLoading && rawChartData.length > 0) {
      const timer = setTimeout(() => {
        setRenderChartData(rawChartData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, rawChartData]);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <Card className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Anual</CardTitle>
        <CardDescription>Janeiro - Dezembro 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[180px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={renderChartData}
            margin={{
              left: isMobile ? -50 : 0,
              right: 10,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillEntry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => value.toLocaleString()}
              className="hidden md:block"
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Area
              type="monotone"
              dataKey="entry"
              stroke="var(--color-chart-2)"
              fillOpacity={1}
              fill="url(#fillEntry)"
              strokeWidth={3}
              isAnimationActive={true}
              animationBegin={100}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="exit"
              stroke="var(--color-chart-5)"
              fillOpacity={1}
              fill="url(#fillExit)"
              strokeWidth={3}
              isAnimationActive={true}
              animationBegin={300}
              animationDuration={1500}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total de Entrada:{" "}
          <span className="dark:text-emerald-400 text-emerald-500">
            {formatCurrency(
              renderChartData.reduce((sum, item) => sum + item.entry, 0),
            )}
          </span>
        </div>
        <div className="flex gap-2 font-medium leading-none">
          Total de Saída:{" "}
          <span className="dark:text-red-400 text-red-500">
            {formatCurrency(
              renderChartData.reduce((sum, item) => sum + item.exit, 0),
            )}
          </span>
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando total de entradas e saídas do último ano.
        </div>
      </CardFooter>
    </Card>
  );
}
