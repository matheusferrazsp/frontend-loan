import { AlertTriangle, ChartSpline, Plus, UserRoundPen } from "lucide-react";

import { useState } from "react";
import { Link, useLocation } from "react-router";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CreateClientDialog } from "@/pages/clients/create-client-dialog";

export function MobileBottomNav() {
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
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
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon
              className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "")}
            />
            <span className="truncate max-w-[64px]">{item.label}</span>
          </Link>
        );
      })}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-8 h-8 shadow-sm">
              <Plus className="h-5 w-5 stroke-[2.5px]" />
            </div>
            <span className="truncate max-w-[64px] font-semibold text-primary mt-[-2px]">
              Novo
            </span>
          </button>
        </DialogTrigger>
        <CreateClientDialog onSuccess={() => setIsDialogOpen(false)} />
      </Dialog>
    </nav>
  );
}
