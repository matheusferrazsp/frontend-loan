import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Download,
  FileDown,
  FileText,
  Filter,
  HelpCircle,
  History,
  Plus,
  Search,
  Sheet,
  Smartphone,
  UserRoundPen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  steps: { title: string; description: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "cadastrar",
    icon: <Plus className="h-4 w-4" />,
    title: "Cadastrar um novo cliente",
    color: "text-emerald-500",
    steps: [
      {
        title: 'Clique em "Novo cliente" (ou "Novo" no celular)',
        description:
          'Na tela de Empréstimos, toque no botão verde "Novo cliente". No celular, use também o botão "Novo Empréstimo" direto do Dashboard.',
      },
      {
        title: "Preencha os dados do cliente",
        description:
          "Informe nome, CPF, telefone, e-mail, endereço, valor do empréstimo, taxa de juros mensal, número de parcelas e data de início.",
      },
      {
        title: "Salve o cadastro",
        description:
          'Clique em "Criar cliente". O cliente aparecerá automaticamente na lista de Empréstimos.',
      },
    ],
  },
  {
    id: "detalhes",
    icon: <Search className="h-4 w-4" />,
    title: "Ver detalhes de um cliente",
    color: "text-blue-500",
    steps: [
      {
        title: "Localize o cliente na tabela",
        description: "Na tela de Empréstimos, encontre o cliente desejado na lista.",
      },
      {
        title: "Abra os detalhes",
        description:
          "Clique no ícone de lupa (🔍) na primeira coluna. Um painel abrirá com todos os dados financeiros, parcelas, datas e histórico de pagamentos.",
      },
      {
        title: "Gere o PDF completo",
        description:
          'Dentro do painel, clique em "Salvar PDF" para um documento completo com todos os dados.',
      },
    ],
  },
  {
    id: "editar",
    icon: <UserRoundPen className="h-4 w-4" />,
    title: "Editar ou excluir um cliente",
    color: "text-violet-500",
    steps: [
      {
        title: "Abra as opções na tabela",
        description:
          'Cada linha possui os botões "Editar" (engrenagem) e "Excluir" (lixeira) nas últimas colunas.',
      },
      {
        title: "Editar",
        description:
          "Clique em Editar para atualizar qualquer dado do cliente — valor, parcelas, datas ou observações.",
      },
      {
        title: "Excluir",
        description:
          "Clique em Excluir e confirme na janela. Atenção: a exclusão é permanente e remove também o histórico de pagamentos.",
      },
    ],
  },
  {
    id: "filtros",
    icon: <Filter className="h-4 w-4" />,
    title: "Usar os filtros da tabela",
    color: "text-amber-500",
    steps: [
      {
        title: "Busca por nome",
        description: "Digite parte do nome do cliente. A tabela filtra em tempo real.",
      },
      {
        title: "Filtro por data de vencimento",
        description: "Selecione uma data para ver apenas os clientes com vencimento naquele dia.",
      },
      {
        title: "Filtro por status",
        description: 'Use "Todos / Em dia / Atrasado / Vence hoje" para segmentar por situação.',
      },
      {
        title: "Filtro de dívida",
        description: 'Use "Dívida Pendente" ou "Dívida Quitada" para separar clientes ativos dos encerrados.',
      },
    ],
  },
  {
    id: "pagamentos",
    icon: <History className="h-4 w-4" />,
    title: "Registrar e ver pagamentos",
    color: "text-cyan-500",
    steps: [
      {
        title: "Abra o detalhe do cliente",
        description: "Clique na lupa da linha do cliente.",
      },
      {
        title: "Veja o histórico",
        description: "A seção inferior do painel exibe todas as datas e valores pagos.",
      },
      {
        title: "Remova um pagamento incorreto",
        description: "Clique no ícone de lixeira ao lado do pagamento para removê-lo.",
      },
    ],
  },
  {
    id: "inadimplentes",
    icon: <AlertTriangle className="h-4 w-4" />,
    title: "Clientes inadimplentes",
    color: "text-rose-500",
    steps: [
      {
        title: 'Acesse a tela "Inadimplentes"',
        description: 'No menu, clique em "Inadimplentes" para ver os clientes marcados manualmente.',
      },
      {
        title: "Marcar como inadimplente",
        description: 'Ao editar um cliente, marque a opção "Inadimplente" para movê-lo para esta lista.',
      },
    ],
  },
  {
    id: "exportar",
    icon: <Download className="h-4 w-4" />,
    title: "Exportar dados",
    color: "text-indigo-500",
    steps: [
      {
        title: "Imprimir tabela como PDF",
        description:
          'Clique em "Imprimir Tabela". Uma nova aba abrirá com a tabela formatada respeitando os filtros ativos.',
      },
      {
        title: "Exportar para CSV (Excel)",
        description:
          'Clique em "Exportar CSV" para baixar uma planilha com todos os dados dos clientes filtrados.',
      },
      {
        title: "PDF do detalhe do cliente",
        description:
          'Dentro do painel de detalhes, clique em "Salvar PDF" para um documento completo.',
      },
    ],
  },
  {
    id: "celular",
    icon: <Smartphone className="h-4 w-4" />,
    title: "Uso no celular",
    color: "text-pink-500",
    steps: [
      {
        title: "Menu hamburguer",
        description: "Toque no ícone ☰ no canto superior esquerdo para abrir o menu.",
      },
      {
        title: "Botão rápido no Dashboard",
        description: '"Novo Empréstimo" no Dashboard abre direto o formulário de cadastro.',
      },
      {
        title: "Botões abreviados",
        description: 'Na tela de Empréstimos, os botões mostram textos curtos: "PDF", "CSV" e "Novo".',
      },
    ],
  },
];

const EXTRA_IDS = ["referencia", "faq"];

const ALL_NAV = [
  ...SECTIONS.map((s) => ({ id: s.id, label: s.title, icon: s.icon, color: s.color })),
  { id: "referencia", label: "Referência de botões", icon: <FileText className="h-4 w-4" />, color: "text-muted-foreground" },
  { id: "faq", label: "Perguntas frequentes", icon: <HelpCircle className="h-4 w-4" />, color: "text-muted-foreground" },
];

const FAQS = [
  {
    question: "O app atualiza automaticamente quando cadastro um cliente?",
    answer:
      "Sim. O VeroFlux usa WebSocket para atualizar a tabela e o dashboard em tempo real, sem recarregar a página.",
  },
  {
    question: "Posso usar o app em vários dispositivos ao mesmo tempo?",
    answer:
      "Sim. Qualquer alteração feita em um dispositivo é refletida automaticamente nos outros que estiverem abertos.",
  },
  {
    question: "O que acontece quando a dívida de um cliente é quitada?",
    answer:
      'Marque "Dívida Quitada" ao editar o cliente. Ele continua na lista mas com status diferenciado. Use o filtro "Dívida Quitada" para consultá-los separadamente.',
  },
  {
    question: "A exportação CSV inclui todos os clientes ou só os da página atual?",
    answer:
      "O CSV exporta todos os clientes filtrados — não apenas os da página atual, mas todos que correspondem aos filtros ativos.",
  },
  {
    question: "Por que o PDF de detalhes abre em uma nova aba?",
    answer:
      "Porque o painel de detalhes tem rolagem interna. A nova aba garante que todos os dados apareçam no PDF sem cortes.",
  },
];

export function UserManual() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const allIds = [...SECTIONS.map((s) => s.id), ...EXTRA_IDS];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex gap-8 max-w-5xl mx-auto pb-16">
      <Helmet title="Manual do Usuário" />

      {/* ── Sidebar nav (sticky, desktop only) ── */}
      <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
        <div className="flex items-center gap-2 mb-3 px-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Conteúdo
          </span>
        </div>
        {ALL_NAV.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-all w-full
                ${isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
            >
              <span className={isActive ? "text-primary" : item.color}>{item.icon}</span>
              <span className="leading-tight">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
            </button>
          );
        })}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Hero */}
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manual do Usuário</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Tudo que você precisa saber para usar o VeroFlux com confiança.
        </p>

        {/* Mobile quick-nav */}
        <div className="flex lg:hidden gap-2 flex-wrap mb-6">
          {ALL_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors
                ${activeId === item.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:bg-accent"
                }`}
            >
              <span>{item.icon}</span>
              {item.label.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="border rounded-lg overflow-hidden scroll-mt-24">
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b">
                <span className={section.color}>{section.icon}</span>
                <span className="font-semibold text-sm">{section.title}</span>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  {section.steps.length} {section.steps.length === 1 ? "passo" : "passos"}
                </Badge>
              </div>
              <div className="divide-y">
                {section.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 px-4 py-3">
                    <div className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <div id="referencia" className="mt-8 border rounded-lg overflow-hidden scroll-mt-24">
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-sm">Referência rápida de botões</span>
          </div>
          <div className="divide-y">
            {[
              { icon: <Plus className="h-3.5 w-3.5" />, label: "Novo cliente / Novo", desc: "Abre o formulário de cadastro" },
              { icon: <Search className="h-3.5 w-3.5" />, label: "Lupa (🔍)", desc: "Abre o painel de detalhes do cliente" },
              { icon: <UserRoundPen className="h-3.5 w-3.5" />, label: "Editar", desc: "Edita os dados do cliente" },
              { icon: <FileDown className="h-3.5 w-3.5" />, label: "PDF / Imprimir Tabela", desc: "Gera e abre o PDF em nova aba" },
              { icon: <Sheet className="h-3.5 w-3.5" />, label: "CSV / Exportar CSV", desc: "Baixa planilha Excel com todos os dados" },
              { icon: <AlertTriangle className="h-3.5 w-3.5" />, label: "Inadimplentes", desc: "Lista de clientes inadimplentes" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex items-center justify-center h-6 w-6 rounded border bg-muted text-muted-foreground">
                  {item.icon}
                </div>
                <span className="text-xs font-semibold w-36 shrink-0">{item.label}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-8 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Perguntas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="px-4 text-sm text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
