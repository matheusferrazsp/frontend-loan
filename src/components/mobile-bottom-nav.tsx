import { AlertTriangle, ChartSpline, Settings, UserRoundPen } from "lucide-react";
import { Link, useLocation } from "react-router";

import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: ChartSpline,
      to: "/dashboard",
    },
    {
      label: "Empréstimos",
      icon: UserRoundPen,
      to: "/clients",
    },
    {
      label: "Inadimplentes",
      icon: AlertTriangle,
      to: "/delinquent-clients",
    },
    {
      label: "Conta",
      icon: Settings,
      to: "/account",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 shadow-lg pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate max-w-[64px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
