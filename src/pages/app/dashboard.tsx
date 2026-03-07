import { io } from "socket.io-client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { AnnualChart } from "@/components/dashboard/annual-chart";
import { FinancialSummaryPie } from "@/components/dashboard/financial-sumary-pie";
import { PieData } from "@/components/dashboard/pie-chart";

import { MonthInterestCard } from "../../components/dashboard/month-interest-card";
import { TotalValueReturned } from "../../components/dashboard/month-returned-value";
import { TotalCash } from "../../components/dashboard/total-cash";
import { TotalLoansOfMonth } from "../../components/dashboard/total-loans-month";

export function Dashboard() {
  // 1. O ESTADO GATILHO: Um número que muda sempre que houver atualização
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
    const socket = io(backendUrl);

    socket.on("clientesAtualizados", () => {
      console.log("🔄 Dashboard: WebSocket disparou! Atualizando painel...");
      setRefreshTrigger((prev) => prev + 1);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("📱 App em foco! Sincronizando dados...");
        setRefreshTrigger((prev) => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      socket.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>DashBoard</title>
      </Helmet>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        {/* 3. INJETANDO O GATILHO NOS CARDS SUPERIORES */}
        <div className="grid gap-4 md:grid-cols-4 md:gap-4">
          <MonthInterestCard refreshTrigger={refreshTrigger} />
          <TotalLoansOfMonth refreshTrigger={refreshTrigger} />
          <TotalValueReturned refreshTrigger={refreshTrigger} />
          <TotalCash refreshTrigger={refreshTrigger} />
        </div>

        {/* INJETANDO O GATILHO NOS GRÁFICOS */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-4">
          <AnnualChart refreshTrigger={refreshTrigger} />
          <PieData refreshTrigger={refreshTrigger} />
          <FinancialSummaryPie refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </>
  );
}
