import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { WhatsNewModal } from "@/components/whats-new-modal";

export default function AppLayout() {
  const navigate = useNavigate();
  const hasToasted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in", { replace: true });
    } else if (!hasToasted.current) {
      // Dispara o toast amigável se estiver logado
      setTimeout(() => {
        toast("Você tem notificações importantes", {
          description: "2 clientes com pagamento pendente hoje.",
          action: {
            label: "Ver",
            onClick: () => navigate("#notifications"),
          },
          icon: "⚠️",
        });
      }, 1000);
      hasToasted.current = true;
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row antialiased">
      <WhatsNewModal />
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  );
}
