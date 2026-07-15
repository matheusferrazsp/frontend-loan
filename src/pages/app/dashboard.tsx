import { socket } from "@/lib/socket";

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import { AnnualChart } from "@/components/dashboard/annual-chart";
import { FinancialSummaryPie } from "@/components/dashboard/financial-sumary-pie";
import { PaidOff } from "@/components/dashboard/paid-off-card";
import { PendingReceiptsCard } from "@/components/dashboard/pending-receipts-card";
import { PieData } from "@/components/dashboard/pie-chart";

import { MonthInterestCard } from "../../components/dashboard/month-interest-card";
import { TotalValueReturned } from "../../components/dashboard/month-returned-value";
import { TotalCash } from "../../components/dashboard/total-cash";
import { TotalLoansOfMonth } from "../../components/dashboard/total-loans-month";

export function Dashboard() {
  const [cardsRefreshTrigger, setCardsRefreshTrigger] = useState(0);
  const [chartsRefreshTrigger, setChartsRefreshTrigger] = useState(0);
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    const triggerRefresh = (reason: string) => {
      const now = Date.now();
      if (now - lastRefreshRef.current < 5000) {
        return;
      }
      lastRefreshRef.current = now;
      console.log(`🔄 Dashboard: sincronizando (${reason})`);
      setCardsRefreshTrigger((prev) => prev + 1);
      setChartsRefreshTrigger((prev) => prev + 1);
    };

    const handleClientesAtualizados = () => triggerRefresh("socket:clientesAtualizados");
    const handleConnect = () => triggerRefresh("socket:connect");
    const handleReconnect = () => triggerRefresh("socket:reconnect");

    socket.on("clientesAtualizados", handleClientesAtualizados);
    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);

    const handleOnline = () => triggerRefresh("online");

    window.addEventListener("online", handleOnline);

    return () => {
      socket.off("clientesAtualizados", handleClientesAtualizados);
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      window.removeEventListener("online", handleOnline);
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <MonthInterestCard refreshTrigger={cardsRefreshTrigger} />
          <TotalLoansOfMonth refreshTrigger={cardsRefreshTrigger} />
          <PendingReceiptsCard refreshTrigger={cardsRefreshTrigger} />
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
