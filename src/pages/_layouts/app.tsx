import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";

import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Header } from "@/components/header";
import { WhatsNewModal } from "@/components/whats-new-modal";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  usePushNotifications();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isBlocked = user && !user.isLifetime && ['pending', 'past_due', 'canceled', 'unpaid'].includes(user.subscriptionStatus);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
      return;
    }

    if (user) {
      const isAdmin = user.email === 'contatomatheus.oferraz@gmail.com';
      
      if (location.pathname === "/admin" && !isAdmin) {
        navigate("/dashboard", { replace: true });
        return;
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row antialiased">
      <WhatsNewModal />
      <Header />

      <div className="flex flex-1 flex-col w-full max-w-full overflow-hidden">
        {isBlocked && location.pathname !== "/account" && (
          <div className="bg-amber-100 border-b border-amber-200 p-3 md:p-4 text-center w-full z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 shrink-0">
            <span className="text-amber-800 text-sm md:text-base font-medium">
              Sua assinatura está pendente. Finalize seu pagamento para criar ou gerenciar seus empréstimos.
            </span>
            <button
              onClick={() => navigate("/account")}
              className="text-amber-900 font-bold underline hover:text-amber-700 text-sm md:text-base"
            >
              Finalizar Assinatura
            </button>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
