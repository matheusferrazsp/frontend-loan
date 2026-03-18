"use client";

import { Loader2, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";

type PaidOffResponse = {
  totalLoanValuePaidOff: number;
  diffPercentage?: number;
};

export function PaidOff({ refreshTrigger }: { refreshTrigger?: number }) {
  const [rawData, setRawData] = useState<PaidOffResponse | null>(null);
  const [renderData, setRenderData] = useState<PaidOffResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setRenderData(null);
      const response = await api.get("/dashboard/paid-off");
      setRawData(response.data);

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
        <Loader2 className="animate-spin" />
      </Card>
    );
  }

  const totalPaidOff = Number(renderData?.totalLoanValuePaidOff ?? 0);
  const diffPercentage = Number(renderData?.diffPercentage ?? 0);
  const isIncrease = diffPercentage > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0 items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Total Pago (Dívidas Pagas)
        </CardTitle>
        <PiggyBank className="h-4 w-4 dark:text-emerald-400 text-emerald-500" />
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {totalPaidOff.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>

        <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
          <span
            className={`flex items-center font-bold ${
              isIncrease
                ? "dark:text-emerald-400 text-emerald-500"
                : "dark:text-rose-400 text-rose-500"
            }`}
          >
            {isIncrease ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {isIncrease ? "+" : ""}
            {diffPercentage}%
          </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  );
}
