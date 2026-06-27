import {
  AlertTriangle,
  Bell,
  BookOpen,
  ChartSpline,
  Crown,
  Menu,
  UserRoundPen,
  X,
  Shield,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";

import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { api } from "@/lib/axios";

import { MobileUserGreeting, SidebarAccountProfile } from "./account-menu";
import { NavLink } from "./nav-link";
import { SidebarThemeToggle, ThemeToggle } from "./theme/theme-toggle";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface NotificationItem {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  type: "warning" | "urgent" | "info";
  isDelinquent?: boolean;
}

let globalHasToasted = false;

function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#notifications") {
      setIsOpen(true);
    }
  }, [location.hash]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await api.get("/clients");
      const clients = Array.isArray(response.data) ? response.data : [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newNotifs: NotificationItem[] = [];

      clients.forEach((client: any) => {
        if (client.totalDebtPaid === true || client.totalDebtPaid === "true")
          return;

        const dueDate = client.nextPaymentDate
          ? new Date(client.nextPaymentDate)
          : null;
        let dueDateZero = null;
        let daysDiff = 0;

        if (dueDate) {
          dueDateZero = new Date(
            dueDate.getUTCFullYear(),
            dueDate.getUTCMonth(),
            dueDate.getUTCDate(),
          );
          const diffTime = dueDateZero.getTime() - today.getTime();
          daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));
        }

        const isPast = dueDateZero && dueDateZero < today;

        if (client.isDelinquent || isPast || client.lateInstallments > 0) {
          const daysLate = isPast
            ? Math.abs(daysDiff)
            : client.lateInstallments > 0
              ? "alguns"
              : 0;

          let title = "Pagamento atrasado";
          if (client.isDelinquent) {
            title = "Cliente Inadimplente";
          } else if (isPast) {
            title = `Pagamento atrasado há ${daysLate} dias`;
          } else if (client.lateInstallments > 0) {
            title = `Possui ${client.lateInstallments} parcelas atrasadas`;
          }

          newNotifs.push({
            id: `urgent-${client.id}`,
            clientId: client.id,
            clientName: client.name,
            title,
            type: "urgent",
            isDelinquent: client.isDelinquent,
          });
        } else if (dueDateZero) {
          if (daysDiff === 0) {
            newNotifs.push({
              id: `due-${client.id}`,
              clientId: client.id,
              clientName: client.name,
              title: "Pagamento vencendo hoje",
              type: "warning",
            });
          } else if (daysDiff > 0 && daysDiff <= 3) {
            newNotifs.push({
              id: `upcoming-${client.id}`,
              clientId: client.id,
              clientName: client.name,
              title: `Pagamento vencendo em ${daysDiff} dias`,
              type: "info",
            });
          }
        }
      });

      setNotifications(newNotifs);

      if (newNotifs.length > 0 && !globalHasToasted) {
        setTimeout(() => {
          toast("Você tem notificações importantes", {
            id: "important-notifications-toast",
            description: `${newNotifs.length} cliente${newNotifs.length > 1 ? "s" : ""} com pendências hoje.`,
            action: {
              label: "Ver",
              onClick: () => navigate("#notifications"),
            },
            icon: "⚠️",
          });
        }, 1000);
        globalHasToasted = true;
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, [navigate]);

  useEffect(() => {
    loadNotifications();

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
    const socket = io(backendUrl, { transports: ["websocket"] });

    socket.on("clientesAtualizados", () => {
      loadNotifications();
    });

    socket.on("connect", () => {
      loadNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, [loadNotifications]);

  const hasUnread = notifications.length > 0;

  const handleNotificationClick = (notif: NotificationItem) => {
    setIsOpen(false);
    if (location.hash === "#notifications") {
      navigate(location.pathname + location.search, { replace: true });
    }

    setTimeout(() => {
      if (notif.isDelinquent) {
        navigate(
          `/delinquent-clients?clientName=${encodeURIComponent(notif.clientName)}&openClientId=${notif.clientId}`,
        );
      } else {
        navigate(
          `/clients?clientName=${encodeURIComponent(notif.clientName)}&openClientId=${notif.clientId}`,
        );
      }
    }, 200);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && location.hash === "#notifications") {
      navigate(location.pathname + location.search, { replace: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-[400px] !max-w-[400px] flex flex-col max-h-[80vh] p-0 rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            Notificações {hasUnread ? `(${notifications.length})` : ""}
          </DialogTitle>
          <DialogDescription>
            Acompanhe o status dos clientes em tempo real.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 pb-6 scrollbar-thin">
          {!hasUnread ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação no momento
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex flex-col items-start gap-1 p-4 cursor-pointer border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <span className="text-sm font-semibold">
                    {notif.clientName}
                  </span>
                  <span className="text-xs text-muted-foreground mb-1">
                    {notif.title}
                  </span>
                  <div>
                    {notif.type === "urgent" && (
                      <span className="text-[10px] font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        Urgente
                      </span>
                    )}
                    {notif.type === "warning" && (
                      <span className="text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                        Atenção
                      </span>
                    )}
                    {notif.type === "info" && (
                      <span className="text-[10px] font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        Aviso
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const userJson = localStorage.getItem("user");
  const storedUser = userJson ? JSON.parse(userJson) : null;
  const adminEmails = [
    "contatomatheus.oferraz@gmail.com",
    "matheusf.tecnologia@gmail.com",
    "matheusferraz@gmail.com"
  ];
  const isAdmin = storedUser?.email && adminEmails.includes(storedUser.email.toLowerCase());

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="border-b md:border-b-0 md:border-r md:w-64 md:shrink-0 md:h-screen sticky top-0 bg-background z-30">
      <div className="flex h-20 md:h-full md:flex-col items-center md:items-start px-5 md:px-6 md:py-8 gap-2 md:gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-10 w-10" />
        </Button>

        <div className="hidden md:flex items-center justify-between w-full px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-primary">
              VeroFlux
            </span>
            {storedUser?.isLifetime && (
              <div title="Sócio Vitalício" className="flex items-center justify-center bg-amber-500/10 text-amber-500 p-1 rounded-md border border-amber-500/20">
                <Crown className="h-4 w-4" />
              </div>
            )}
          </div>
          <NotificationBell />
        </div>

        <nav className="hidden md:flex md:flex-col items-start space-x-0 md:space-x-0 space-y-0 md:space-y-2 w-full">
          <NavLink
            to="/"
            className="w-full justify-start px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground data-[current=true]:bg-accent data-[current=true]:text-accent-foreground transition-colors"
          >
            <ChartSpline className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/clients"
            className="w-full justify-start px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground data-[current=true]:bg-accent data-[current=true]:text-accent-foreground transition-colors"
          >
            <UserRoundPen className="h-4 w-4 mr-2" />
            <span>Empréstimos</span>
          </NavLink>

          <NavLink
            to="/delinquent-clients"
            className="w-full justify-start px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground data-[current=true]:bg-accent data-[current=true]:text-accent-foreground transition-colors"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>Inadimplentes</span>
          </NavLink>

          <NavLink
            to="/manual"
            className="w-full justify-start px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground data-[current=true]:bg-accent data-[current=true]:text-accent-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Manual do Usuário</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className="w-full justify-start px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground data-[current=true]:bg-accent data-[current=true]:text-accent-foreground transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              <span>Painel Admin</span>
            </NavLink>
          )}

          <SidebarThemeToggle />
        </nav>

        {/* Versão Desktop: Perfil do usuário tipo cartão no rodapé */}
        <div className="hidden md:flex mt-auto w-full">
          <SidebarAccountProfile />
        </div>

        {/* Versão Mobile: Saudação e Tema na Topbar */}
        <div className="ml-auto flex md:hidden items-center gap-1">
          <NotificationBell />
          <MobileUserGreeting />
          <ThemeToggle />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`h-full w-3/4 md:w-1/2 bg-background border-r p-4 transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Menu
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fechar menu de navegação"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <NavLink
              to="/"
              className="rounded-md px-3 py-2 text-base hover:bg-accent"
            >
              <ChartSpline className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/clients"
              className="rounded-md px-3 py-2 text-base hover:bg-accent"
            >
              <UserRoundPen className="h-5 w-5" />
              <span>Empréstimos</span>
            </NavLink>

            <NavLink
              to="/delinquent-clients"
              className="rounded-md px-3 py-2 text-base hover:bg-accent"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Inadimplentes</span>
            </NavLink>

            <NavLink
              to="/manual"
              className="rounded-md px-3 py-2 text-base hover:bg-accent"
            >
              <BookOpen className="h-5 w-5" />
              <span>Manual do usuário</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className="rounded-md px-3 py-2 text-base hover:bg-accent"
              >
                <Shield className="h-5 w-5" />
                <span>Painel Admin</span>
              </NavLink>
            )}
          </nav>

          <div className="mt-auto hidden md:block" />
          <div className="md:hidden mt-auto -mx-2">
            <SidebarAccountProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
