import { Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await api.get("/dashboard/annual-stats");
      setChartData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading && chartData.length === 0) {
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
      <CardContent className="flex-1 flex md:pt-15">
        <ChartContainer
          config={chartConfig}
          className="mx-auto md:max-h-[250px] aspect-square w-full "
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: isMobile ? -50 : 0,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 1)}
            />
            <YAxis
              tickFormatter={(value) => value.toLocaleString()}
              className="hidden md:block"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="entry"
              fill="var(--color-chart-2)"
              radius={4}
              barSize={8}
            />
            <Bar
              dataKey="exit"
              fill="var(--color-chart-5)"
              radius={4}
              barSize={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total de Entrada:{" "}
          <span className="dark:text-emerald-400 text-emerald-500">
            {formatCurrency(
              chartData.reduce((sum, item) => sum + item.entry, 0),
            )}
          </span>
        </div>
        <div className="flex gap-2 font-medium leading-none">
          Total de Saída:{" "}
          <span className="dark:text-red-400 text-red-500">
            {formatCurrency(
              chartData.reduce((sum, item) => sum + item.exit, 0),
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
