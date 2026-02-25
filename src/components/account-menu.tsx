import { Building, ChevronDown, LogOut } from "lucide-react";

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

  // 1. Busca os dados do usuário salvos no SignIn
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : { name: "Usuário", email: "" };

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
          {user.name.split(" ")[0]}
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

        <DropdownMenuItem>
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
