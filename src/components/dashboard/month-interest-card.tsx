"use client";

import {
  BanknoteArrowUp,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";

export function MonthInterestCard({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [data, setData] = useState<{
    totalInterest: number;
    diffPercentage: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await api.get("/dashboard/total-loan-interest");
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  if (loading && !data) {
    return (
      <Card className="h-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const isPositive = (data?.diffPercentage ?? 0) >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0 items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Total de Juros(Mês)
        </CardTitle>
        <BanknoteArrowUp className="h-4 w-4 t dark:text-emerald-400 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {data?.totalInterest.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
          <span
            className={`flex items-center font-bold ${isPositive ? "dark:text-emerald-400 text-emerald-500" : "dark:text-rose-400 text-rose-500"}`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {isPositive ? "+" : ""}
            {data?.diffPercentage}%
          </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  );
}
