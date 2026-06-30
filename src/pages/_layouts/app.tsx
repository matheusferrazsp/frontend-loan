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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const isBlocked = !user.isLifetime && ['pending', 'past_due', 'canceled', 'unpaid'].includes(user.subscriptionStatus);
      const isAdmin = user.email === 'contatomatheus.oferraz@gmail.com';
      
      if (location.pathname === "/admin" && !isAdmin) {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (isBlocked && location.pathname !== "/account" && location.pathname !== "/admin") {
        navigate("/account", { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row antialiased">
      <WhatsNewModal />
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6 pb-24 md:pb-8 w-full max-w-full overflow-hidden">
        <Outlet />
      </div>

      <MobileBottomNav />
    </div>
  );
}
