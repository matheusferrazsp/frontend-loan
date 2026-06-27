import { BellRing, LayoutTemplate, MonitorSmartphone, Rocket, Sparkles, X } from "lucide-react";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Incrementar esta chave sempre que quiser exibir o modal novamente
const WHATS_NEW_KEY = "whatsNew_v1.5";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const FEATURES: Feature[] = [
  {
    icon: <BellRing className="h-4 w-4 text-emerald-400" />,
    title: "Notificações Precisas e em Tempo Real",
    description:
      "O alerta do sino agora mostra o número exato de pendências e atualiza sozinho sem precisar recarregar a página.",
    badge: "Correção",
  },
  {
    icon: <MonitorSmartphone className="h-4 w-4 text-violet-400" />,
    title: "Fim dos Alertas Duplicados",
    description:
      "Corrigido o problema que fazia os avisos de novas notificações aparecerem duas vezes na tela.",
    badge: "Correção",
  },
  {
    icon: <LayoutTemplate className="h-4 w-4 text-blue-400" />,
    title: "Posicionamento dos Avisos",
    description:
      "Os avisos de sucesso ao salvar clientes agora aparecem centralizados, facilitando a leitura.",
    badge: "Melhoria",
  },
  {
    icon: <Rocket className="h-4 w-4 text-amber-400" />,
    title: "Interação e Acessibilidade",
    description:
      "Agora é possível fechar os avisos mesmo com formulários abertos e botões desativados mostram o cursor de bloqueio.",
    badge: "Correção",
  },
];

export function WhatsNewModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WHATS_NEW_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(WHATS_NEW_KEY, "true");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="w-90 sm:min-w-[360px] max-w-[90vw] gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-5 pt-5 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Novidades
            </span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              O que há de novo? 🎉
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mt-0.5">
            Últimas melhorias adicionadas ao VeroFlux.
          </p>
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        {/* Features */}
        <div className="px-5 py-3.5 flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{feature.title}</span>
                  {feature.badge && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 h-3.5 bg-primary/15 text-primary border-0"
                    >
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button size="sm" className="w-full" onClick={handleClose}>
            Entendido!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
