import { ChartSpline, UserRoundPen } from "lucide-react";

import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-20 items-center px-5 md:px-6 gap-2 md:gap-4">
        <nav className="flex items-center space-x-5 md:space-x-4 lg:space-x-6">
          {/* Dashboard: Apenas o ícone no mobile, texto aparece no desktop */}
          <NavLink to="/">
            <ChartSpline className="h-5 w-5 md:h-4 md:w-4" />
            <span className="md:inline">Dashboard</span>
          </NavLink>

          {/* Clientes: Ícone + Texto sempre visíveis */}
          <NavLink to="/clients">
            <UserRoundPen className="h-5 w-5 md:h-4 md:w-4" />
            <span className="text-sm md:text-base">Clientes</span>
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
