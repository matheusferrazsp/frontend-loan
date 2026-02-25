import { Landmark } from "lucide-react";

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2 antialiased">
      {/* ... seu código de branding e Landmark ... */}
      <div className="md:h-full border-b md:border-r md:border-b-0 border-foreground/5 md:bg-muted p-10 text-muted-foreground flex flex-col md:justify-between">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <Landmark className="h-5 w-5" />
          <span className="font-semibold">LoanX</span>
        </div>

        <footer className="hidden md:block text-sm">
          Painel do usuário LoanX &copy; Matheus Ferraz -{" "}
          {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <Outlet />
      </div>

      {/* Footer mobile */}
      <footer className="block md:hidden text-sm text-muted-foreground text-center p-4 mt-auto">
        Painel do usuário LoanX &copy; Matheus Ferraz -{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
