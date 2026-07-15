import {
  AlertCircle,
  CreditCard,
  ExternalLink,
  Info,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { isSubscriptionBlocked } from "@/lib/utils";

export function BlockedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isTrialExpired = user?.subscriptionStatus === "trialing" && user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date();

  async function handleCheckout() {
    try {
      setIsLoading(true);
      // Calls our backend that creates a stripe session
      const response = await api.post("/api/checkout");
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Erro ao redirecionar para o pagamento.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePortal() {
    try {
      setIsLoading(true);
      const response = await api.post("/api/billing-portal");
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Erro ao abrir portal do cliente.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background relative">
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sair / Trocar de conta
      </Button>

      <div className="max-w-md w-full p-8 border rounded-xl shadow-lg bg-card text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          {isTrialExpired ? "Período de Teste Expirado" : "Acesso Bloqueado"}
        </h1>

        <p className="text-muted-foreground text-sm">
          {isTrialExpired
            ? "Seu período de teste grátis de 3 dias expirou. Para continuar acessando a plataforma e cadastrando ou gerenciando clientes, realize o pagamento da assinatura mensal."
            : "Sua assinatura encontra-se com o pagamento pendente ou inativo. Por favor, regularize sua situação para continuar utilizando a plataforma e não perder o acesso aos seus clientes."}
        </p>

        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Pagar Assinatura (R$ 29,90)
          </Button>

          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                const response = await api.get(
                  `/users/${user.id}/status-check`,
                );
                if (["active", "trialing"].includes(response.data?.subscriptionStatus) && !isSubscriptionBlocked(response.data)) {
                  localStorage.setItem("user", JSON.stringify(response.data));
                  toast.success("Assinatura confirmada!");
                  navigate("/dashboard");
                } else {
                  toast.error(
                    "O pagamento ainda não foi processado ou está pendente.",
                  );
                }
              } catch (e) {
                toast.error("Erro ao verificar assinatura.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading || !user?.id}
            variant="outline"
            className="w-full gap-2"
          >
            Já paguei / Verificar Sistema
          </Button>

          {user?.stripeCustomerId && (
            <Button
              onClick={handlePortal}
              disabled={isLoading}
              variant="ghost"
              className="w-full gap-2 text-muted-foreground"
            >
              <ExternalLink className="w-4 h-4" />
              Atualizar Cartão / Portal
            </Button>
          )}
        </div>

        <div className="flex items-start gap-2 mt-4 text-xs text-left text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Após o cadastro/pagamento, o acesso é liberado automaticamente. Caso
            você já seja um cliente vitalício, contate o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
