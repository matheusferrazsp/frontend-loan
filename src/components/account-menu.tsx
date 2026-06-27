import { Building, ChevronDown, LogOut, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
      return { name: "Usuário", email: "", isLifetime: false };
    }

    try {
      const parsed = JSON.parse(userJson);
      return {
        name: parsed.name ?? "Usuário",
        email: parsed.email ?? "",
        isLifetime: parsed.isLifetime ?? false,
      };
    } catch {
      return { name: "Usuário", email: "", isLifetime: false };
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

  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
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
            <div className="flex items-center gap-2">
              <span>{user.name}</span>
              {user.isLifetime && (
                <div title="Sócio Vitalício" className="flex items-center justify-center bg-amber-500/10 text-amber-500 p-0.5 rounded-sm border border-amber-500/20">
                  <Crown className="h-3 w-3" />
                </div>
              )}
            </div>
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
            onSelect={(e) => {
              e.preventDefault();
              setShowSignOut(true);
            }}
            className="text-rose-500 dark:text-rose-400 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutModal 
        open={showSignOut} 
        onOpenChange={setShowSignOut} 
        onConfirm={handleSignOut} 
      />
    </>
  );
}

function SignOutModal({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Sua sessão será encerrada e você precisará fazer login novamente para acessar o sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-rose-500 hover:bg-rose-600 text-white">
            Sair da conta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SidebarAccountProfile() {
  const navigate = useNavigate();

  const readStoredUser = () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return { name: "Usuário", email: "", isLifetime: false };
    try {
      const parsed = JSON.parse(userJson);
      return { name: parsed.name ?? "Usuário", email: parsed.email ?? "", isLifetime: parsed.isLifetime ?? false };
    } catch {
      return { name: "Usuário", email: "", isLifetime: false };
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

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
  }

  const initials = user.name.charAt(0).toUpperCase();
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between w-full py-4 px-2 border-t mt-auto">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/account")}
        >
          <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 font-bold shrink-0 ${user.isLifetime ? "border-amber-500 text-amber-600 bg-amber-500/10" : "border-primary/60 text-primary bg-primary/5"}`}>
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-foreground leading-tight truncate flex items-center gap-1">
              {user.name}
              {user.isLifetime && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
            </span>
            <span className={`text-xs mt-0.5 hover:underline truncate ${user.isLifetime ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
              {user.isLifetime ? "Sócio Vitalício" : "Meu perfil"}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSignOut(true)}
          className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors shrink-0 ml-2"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <SignOutModal 
        open={showSignOut} 
        onOpenChange={setShowSignOut} 
        onConfirm={handleSignOut} 
      />
    </>
  );
}

export function MobileUserGreeting() {
  const readStoredUser = () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return { name: "Usuário", email: "" };
    try {
      const parsed = JSON.parse(userJson);
      return { name: parsed.name ?? "Usuário", email: parsed.email ?? "" };
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

  const firstName = user.name.split(" ")[0];

  return (
    <span className="text-sm font-medium mr-1 truncate max-w-[120px]">
      Olá, {firstName}
    </span>
  );
}
