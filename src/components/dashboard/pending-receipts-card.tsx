"use client";

import {
  Banknote,
  Loader2,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";

export function PendingReceiptsCard({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [rawData, setRawData] = useState<{
    pendingTotal: number;
  } | null>(null);

  const [renderData, setRenderData] = useState<{
    pendingTotal: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setRawData(null);
      const response = await api.get("/dashboard/pending-receipts");
      const data = response.data;

      if (data && typeof data.pendingTotal === "number") {
        setRawData(data);
      } else {
        console.warn(
          "Dados inválidos recebidos para pending-receipts-card:",
          data,
        );
        setRawData({ pendingTotal: 0 });
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Erro ao carregar valores a receber:", error);
      setRawData({ pendingTotal: 0 });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  useEffect(() => {
    if (!isLoading && rawData) {
      setTimeout(() => {
        setRenderData(rawData);
      }, 50);
    } else {
      setRenderData(null);
    }
  }, [isLoading, rawData]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">À Receber</CardTitle>
        <Banknote className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent className="space-y-1 relative min-h-[60px]">
        {isLoading || !renderData ? (
          <div className="absolute inset-0 flex items-center pt-2 justify-start pb-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 fill-mode-forwards">
            <span className="text-2xl font-bold tracking-tight">
              {renderData.pendingTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Restantes neste mês
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
