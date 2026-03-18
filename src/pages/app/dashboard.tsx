import { io } from "socket.io-client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { AnnualChart } from "@/components/dashboard/annual-chart";
import { FinancialSummaryPie } from "@/components/dashboard/financial-sumary-pie";
import { PaidOff } from "@/components/dashboard/paid-off-card";
import { PieData } from "@/components/dashboard/pie-chart";
import { Button } from "@/components/ui/button";

import { MonthInterestCard } from "../../components/dashboard/month-interest-card";
import { TotalValueReturned } from "../../components/dashboard/month-returned-value";
import { TotalCash } from "../../components/dashboard/total-cash";
import { TotalLoansOfMonth } from "../../components/dashboard/total-loans-month";

export function Dashboard() {
  const [cardsRefreshTrigger, setCardsRefreshTrigger] = useState(0);
  const [chartsRefreshTrigger, setChartsRefreshTrigger] = useState(0);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
    const socket = io(backendUrl, {
      transports: ["websocket"],
      reconnection: true,
    });

    const triggerRefresh = (reason: string) => {
      console.log(`🔄 Dashboard: sincronizando (${reason})`);
      setCardsRefreshTrigger((prev) => prev + 1);
      setChartsRefreshTrigger((prev) => prev + 1);
    };

    socket.on("clientesAtualizados", () => {
      triggerRefresh("socket:evento clientesAtualizados");
    });

    socket.on("connect", () => {
      triggerRefresh("socket:connect");
    });

    socket.on("reconnect", () => {
      triggerRefresh("socket:reconnect");
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh("visibilitychange");
      }
    };

    const handleFocus = () => triggerRefresh("focus");
    const handleOnline = () => triggerRefresh("online");
    const handlePageShow = () => triggerRefresh("pageshow");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      socket.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("pageshow", handlePageShow);
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
        <div>
          <Button
            className="md:hidden border-1 dark:border-emerald-400 border-emerald-500 mb-2 mt-2"
            variant="ghost"
            size="lg"
          >
            <a
              className="dark:text-emerald-400 text-emerald-500 font-medium"
              href="/clients"
            >
              Novo Empréstimo
            </a>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5 md:gap-4">
          <MonthInterestCard refreshTrigger={cardsRefreshTrigger} />
          <TotalLoansOfMonth refreshTrigger={cardsRefreshTrigger} />
          <TotalValueReturned refreshTrigger={cardsRefreshTrigger} />
          <TotalCash refreshTrigger={cardsRefreshTrigger} />
          <PaidOff refreshTrigger={cardsRefreshTrigger} />
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-4">
          <FinancialSummaryPie refreshTrigger={chartsRefreshTrigger} />
          <PieData refreshTrigger={chartsRefreshTrigger} />
          <AnnualChart refreshTrigger={chartsRefreshTrigger} />
        </div>
      </div>
    </>
  );
}
