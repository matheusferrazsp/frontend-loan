import {
  AlertTriangle,
  BookOpen,
  ChartSpline,
  Menu,
  UserRoundPen,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { AccountMenu, SidebarAccountProfile, MobileUserGreeting } from "./account-menu";
import { NavLink } from "./nav-link";
import { SidebarThemeToggle, ThemeToggle } from "./theme/theme-toggle";
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
    <div className="border-b md:border-b-0 md:border-r md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 bg-background z-30">
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

        <div className="hidden md:flex items-center gap-3 w-full px-2 mb-2">
          <span className="font-bold text-xl tracking-tight text-primary">
            VeroFlux
          </span>
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

          <SidebarThemeToggle />
        </nav>

        {/* Versão Desktop: Perfil do usuário tipo cartão no rodapé */}
        <div className="hidden md:flex mt-auto w-full">
          <SidebarAccountProfile />
        </div>

        {/* Versão Mobile: Saudação e Tema na Topbar */}
        <div className="ml-auto flex md:hidden items-center gap-2">
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
              <span>Manual</span>
            </NavLink>
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
