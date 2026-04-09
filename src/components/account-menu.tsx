import { Building, ChevronDown, LogOut } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Importe o navigate

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AccountMenu() {
  const navigate = useNavigate();

  const readStoredUser = () => {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
      return { name: "Usuário", email: "" };
    }

    try {
      const parsed = JSON.parse(userJson);
      return {
        name: parsed.name ?? "Usuário",
        email: parsed.email ?? "",
      };
    } catch {
      return { name: "Usuário", email: "" };
    }
  };

  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("user-updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-updated", syncUser);
    };
  }, []);

  // 2. Função de Logout
  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 md:gap-2 select-none text-sm md:text-sm"
        >
          Conta
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/account")}
          className="cursor-pointer"
        >
          <Building className="mr-2 h-4 w-4" />
          <span>Perfil do usuário</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-rose-500 dark:text-rose-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
