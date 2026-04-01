import {
  AlertTriangle,
  ChartSpline,
  Menu,
  UserRoundPen,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { Button } from "./ui/button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

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
    <div className="border-b">
      <div className="flex h-20 items-center px-5 md:px-6 gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-10 w-10" />
        </Button>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <ChartSpline className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/clients">
            <UserRoundPen className="h-4 w-4" />
            <span>Empréstimos</span>
          </NavLink>

          <NavLink to="/delinquent-clients">
            <AlertTriangle className="h-4 w-4" />
            <span>Inadimplentes</span>
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
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
          className={`h-full w-1/2 bg-background border-r p-4 transition-transform duration-300 ease-in-out ${
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
          </nav>
        </div>
      </div>
    </div>
  );
}
