import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

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
      <div className="relative md:h-full border-b md:border-r md:border-b-0 border-foreground/5 p-10 flex flex-col overflow-hidden bg-zinc-950">
        {/* Imagem de Fundo (Gerada por IA) */}
        <img 
          src="/login-bg-v2.png" 
          alt="Controle Financeiro e Dashboard" 
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center opacity-90 z-0"
        />
        {/* Gradiente escuro da esquerda para a direita para dar leitura aos textos */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0" />

        {/* Conteúdo sobreposto */}
        <div className="relative z-10 flex items-center gap-3 text-lg font-medium text-white mb-16 mt-2">
          <img src="/logo.png" alt="VeroFlux Logo" className="h-6 w-6 brightness-0 invert drop-shadow-md" />
          <span className="font-bold tracking-wide drop-shadow-md text-2xl">VeroFlux</span>
        </div>

        <div className="relative z-10 hidden md:flex flex-col mt-8 max-w-md">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg leading-[1.1]">
            Transforme sua gestão financeira em <span className="text-[#00c48c]">vantagem competitiva</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-sm">
            Tenha visibilidade absoluta da sua operação e garanta conversão superior em todas as suas cobranças.
          </p>
          <Button asChild className="w-fit bg-[#00c48c] hover:bg-[#00c48c]/90 text-white font-bold h-12 px-8 rounded-md">
            <a href="https://wa.me/5511921848879" target="_blank" rel="noreferrer">
              Fale com um especialista <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <footer className="relative z-10 hidden md:block text-sm text-white/40 mt-auto">
          Painel do usuário VeroFlux &copy; FerrazDev -{" "}
          {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <Outlet />
      </div>

      {/* Footer mobile */}
      <footer className="block md:hidden text-sm text-muted-foreground text-center p-4 mt-auto">
        Painel do usuário VeroFlux &copy; FerrazDev - {new Date().getFullYear()}
      </footer>
    </div>
  );
}
