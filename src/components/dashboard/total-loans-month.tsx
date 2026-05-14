"use client";

import {
  BanknoteArrowDown,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";

export function TotalLoansOfMonth({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [rawData, setRawData] = useState<{
    totalOutflow: number;
    diffPercentage: number;
  } | null>(null);

  const [renderData, setRenderData] = useState<{
    totalOutflow: number;
    diffPercentage: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setRawData(null);
      const response = await api.get("/dashboard/total-outflow");
      const data = response.data;

      if (data && typeof data.totalOutflow === "number") {
        setRawData(data);
      } else {
        console.warn(
          "Dados inválidos recebidos para month-totalOutlow-value:",
          data,
        );
        setRawData({ totalOutflow: 0, diffPercentage: 0 });
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Erro ao carregar empréstimos do mês:", error);
      setRawData({ totalOutflow: 0, diffPercentage: 0 });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  useEffect(() => {
    if (!isLoading && rawData) {
      const timer = setTimeout(() => {
        setRenderData(rawData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, rawData]);

  if (isLoading) {
    return (
      <Card className="h-32 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const isIncrease = (renderData?.diffPercentage ?? 0) > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0 items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium ">
          Total de Saídas (Mês)
        </CardTitle>
        <BanknoteArrowDown className="h-4 w-4 dark:text-rose-400 text-rose-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {renderData?.totalOutflow.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
          <span
            className={`flex items-center font-bold ${isIncrease ? " dark:text-rose-400 text-rose-500" : "dark:text-emerald-400 text-emerald-500"}`}
          >
            {isIncrease ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {isIncrease ? "+" : ""}
            {Number(renderData?.diffPercentage || 0).toFixed(2)}%
          </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  );
}
