import {
  AlertTriangle,
  Bell,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MessageCircleQuestion,
  PieChart,
  ShieldCheck,
  TrendingUp,
  UserRoundPen,
  Wallet,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* HEADER FLUTUANTE */}
      <header className="fixed top-4 z-50 w-full px-4">
        <div className="container mx-auto max-w-5xl rounded-full border border-muted/60 bg-background/70 backdrop-blur-xl shadow-lg flex h-16 items-center justify-between px-4 md:px-6 transition-all duration-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#00c48c]" />
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              VeroFlux
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#funcionalidades"
              className="text-sm font-semibold text-muted-foreground hover:text-[#00c48c] transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#vantagens"
              className="text-sm font-semibold text-muted-foreground hover:text-[#00c48c] transition-colors"
            >
              Vantagens
            </a>
            <a
              href="#faq"
              className="text-sm font-semibold text-muted-foreground hover:text-[#00c48c] transition-colors"
            >
              Dúvidas Frequentes
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="ghost"
                className="font-semibold text-muted-foreground hover:text-foreground rounded-full"
                asChild
              >
                <Link to="/sign-in">Entrar</Link>
              </Button>
              <Button
                className="rounded-full bg-[#00c48c] hover:bg-[#00c48c]/90 text-white font-bold shadow-md shadow-[#00c48c]/20"
                asChild
              >
                <Link to="/sign-up">Começar Grátis</Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`h-full w-3/4 max-w-sm bg-background border-r p-6 transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#00c48c]" />
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                VeroFlux
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <a
              href="#funcionalidades"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-[#00c48c]"
            >
              Funcionalidades
            </a>
            <a
              href="#vantagens"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-[#00c48c]"
            >
              Vantagens
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium hover:text-[#00c48c]"
            >
              Dúvidas Frequentes
            </a>
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/sign-in">Entrar</Link>
            </Button>
            <Button
              className="w-full bg-[#00c48c] hover:bg-[#00c48c]/90 text-white font-bold shadow-md shadow-[#00c48c]/20"
              asChild
            >
              <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 pt-24">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          {/* Abstract Chart Background Elements */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Glowing Area & Animated Chart Line */}
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary/20 opacity-40 blur-[100px]"></div>
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none flex justify-center items-end opacity-40 dark:opacity-20 pb-20">
            <svg
              width="120vw"
              height="100%"
              viewBox="0 0 1200 600"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 600 C 200 500, 300 550, 500 400 C 700 250, 800 350, 1000 150 L 1200 0"
                stroke="url(#paint0_linear)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="15 15"
                className="animate-dash"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="600"
                  x2="1200"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="var(--color-primary)" />
                  <stop
                    offset="1"
                    stopColor="var(--color-primary)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 -z-10" />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text */}
              <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c48c]/10 text-[#00c48c] mb-6 text-sm font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-[#00c48c] animate-pulse"></span>
                  Gerencie seus empréstimos
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Profissionalize suas{" "}
                  <span className="text-[#00c48c]">Cobranças</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-lg">
                  Automatize cálculos de juros, controle inadimplências e tenha
                  uma visão clara dos seus recebíveis em uma única plataforma
                  feita para o seu negócio.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base h-12 px-8 rounded-full bg-[#00c48c] hover:bg-[#00c48c]/90 text-white"
                    asChild
                  >
                    <Link to="/sign-up">Teste Grátis por 3 Dias</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base h-12 px-8 rounded-full border-muted/50 hover:bg-muted/20"
                    asChild
                  >
                    <a href="#planos">
                      Saber mais <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right Column: PRODUCT SHOWCASE */}
              <div className="relative w-full max-w-2xl mx-auto lg:mr-0 perspective-1000 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                {/* Main Dashboard Window */}
                <div className="relative rounded-xl border bg-background/50 backdrop-blur-md shadow-2xl overflow-hidden md:aspect-auto mx-4 md:mx-0">
                  {/* Window Controls Header */}
                  <div className="flex items-center px-4 py-3 border-b bg-muted/30">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="mx-auto flex gap-2 text-xs font-medium text-muted-foreground items-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      VeroFlux - Painel
                    </div>
                  </div>
                  {/* Window Content (Native Simulation) */}
                  <div className="w-full h-[400px] bg-background flex text-foreground font-sans text-sm border-t overflow-hidden">
                    {/* Sidebar */}
                    <div className="hidden sm:flex w-36 bg-card border-r flex-col p-2 gap-1.5 shrink-0">
                      <div className="flex items-center gap-2 mb-3 px-2 py-1 text-primary">
                        <TrendingUp className="h-5 w-5 shrink-0" />
                        <span className="font-bold text-sm truncate">VeroFlux</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 text-primary">
                        <LayoutDashboard className="h-4 w-4 shrink-0" /> <span className="text-[11px] font-medium truncate">Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-muted/50">
                        <UserRoundPen className="h-4 w-4 shrink-0" /> <span className="text-[11px] font-medium truncate">Empréstimos</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-muted/50">
                        <AlertTriangle className="h-4 w-4 shrink-0" /> <span className="text-[11px] font-medium truncate">Inadimplentes</span>
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 overflow-hidden bg-muted/10 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg">Dashboard</h3>
                      
                      {/* Top Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {/* Card 1 */}
                        <div className="bg-card border rounded-lg p-2.5 shadow-sm flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-bold truncate">Total de Juros</span>
                          <span className="font-bold text-sm text-[#00c48c] truncate">R$ 11.700,00</span>
                          <span className="text-[8px] text-[#00c48c] bg-[#00c48c]/10 w-fit px-1 rounded mt-1 truncate">+100%</span>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-card border rounded-lg p-2.5 shadow-sm flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-bold truncate">Total de Saídas</span>
                          <span className="font-bold text-sm text-rose-500 truncate">R$ 55.000,00</span>
                          <span className="text-[8px] text-rose-500 bg-rose-500/10 w-fit px-1 rounded mt-1 truncate">-147%</span>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-card border rounded-lg p-2.5 shadow-sm flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-bold truncate">Total Entradas</span>
                          <span className="font-bold text-sm text-[#00c48c] truncate">R$ 11.000,00</span>
                          <span className="text-[8px] text-[#00c48c] bg-[#00c48c]/10 w-fit px-1 rounded mt-1 truncate">+10%</span>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-card border rounded-lg p-2.5 shadow-sm flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-bold truncate">Total Circulando</span>
                          <span className="font-bold text-sm text-amber-500 truncate">R$ 58.500,00</span>
                          <span className="text-[8px] text-amber-500 bg-amber-500/10 w-fit px-1 rounded mt-1 truncate">~100%</span>
                        </div>
                      </div>

                      {/* Charts Area */}
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col items-center justify-center relative">
                          <span className="absolute top-3 left-4 text-xs font-semibold">Gráfico de clientes</span>
                          <div className="w-24 h-24 rounded-full border-[6px] border-rose-500 flex items-center justify-center border-l-[#00c48c] border-b-[#00c48c] rotate-45">
                            <div className="w-full h-full rounded-full flex flex-col items-center justify-center -rotate-45">
                              <span className="text-xl font-bold">1</span>
                              <span className="text-[9px] text-muted-foreground">Atrasados</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col justify-end relative">
                          <span className="absolute top-3 left-4 text-xs font-semibold">Desempenho</span>
                          {/* Mini Bar Chart */}
                          <div className="flex items-end justify-between h-20 gap-2 w-full pt-4">
                            <div className="w-full bg-[#00c48c]/20 h-[30%] rounded-t-sm" />
                            <div className="w-full bg-[#00c48c]/40 h-[50%] rounded-t-sm" />
                            <div className="w-full bg-[#00c48c]/60 h-[70%] rounded-t-sm" />
                            <div className="w-full bg-rose-500/80 h-[40%] rounded-t-sm" />
                            <div className="w-full bg-[#00c48c] h-[90%] rounded-t-sm shadow-[0_0_8px_rgba(0,196,140,0.4)]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -left-12 top-1/4 rounded-full border border-muted bg-background/90 backdrop-blur-md shadow-2xl px-5 py-3 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
                  <div className="h-10 w-10 rounded-full bg-[#00c48c]/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#00c48c]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      Verifique recebimentos
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Pagamentos confirmados
                    </span>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-1/4 rounded-full border border-muted bg-background/90 backdrop-blur-md shadow-2xl px-5 py-3 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                  <div className="h-10 w-10 rounded-full bg-[#00c48c]/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#00c48c]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      Lucro do mês
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Capitalizado no período
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES SECTION */}
        <section id="funcionalidades" className="py-24 bg-muted/10 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c48c]/30 text-[#00c48c] mb-6 text-sm font-medium">
                <LayoutDashboard className="h-4 w-4" />
                Plataforma Completa
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Tudo o que você precisa em um só lugar
              </h2>
              <p className="text-lg text-muted-foreground">
                Deixe as planilhas para trás. O VeroFlux automatiza todo o
                trabalho duro para você focar no que importa: fazer o seu
                negócio crescer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 lg:grid-rows-2 gap-6">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-[#00c48c]/10 flex items-center justify-center mb-6 text-[#00c48c] group-hover:scale-110 transition-transform">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Controle de Empréstimos
                </h3>
                <p className="text-muted-foreground">
                  Cadastre clientes, defina valores, taxas de juros, e calcule
                  automaticamente o número de parcelas e os recebimentos
                  futuros.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Gestão de Inadimplência
                </h3>
                <p className="text-muted-foreground">
                  Monitoramento contínuo de parcelas vencidas. O sistema aponta
                  automaticamente atrasos e permite marcar devedores crônicos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Notificações Inteligentes
                </h3>
                <p className="text-muted-foreground">
                  Uma central de alertas avisa em tempo real sobre vencimentos
                  do dia e pagamentos em atraso, para você agir rápido.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fichas em PDF</h3>
                <p className="text-muted-foreground">
                  Gere extratos e relatórios profissionais com apenas um clique
                  para enviar ao seu cliente ou guardar no seu controle interno.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Cobrança via WhatsApp
                </h3>
                <p className="text-muted-foreground">
                  Integração nativa com o WhatsApp. Inicie conversas com seus
                  devedores sem precisar salvar números cadastrados no app.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 lg:col-span-2">
                <div className="h-12 w-12 rounded-xl bg-[#00c48c]/10 flex items-center justify-center mb-6 text-[#00c48c] group-hover:scale-110 transition-transform">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dashboard Analítico</h3>
                <p className="text-muted-foreground max-w-2xl">
                  Painéis visuais para entender a saúde do seu negócio: veja seu
                  capital emprestado rodando no mercado, lucro no mês, total
                  pago e projeções financeiras em um piscar de olhos.
                </p>
              </div>

              {/* Feature 7 */}
              <div className="group relative overflow-hidden rounded-[24px] border bg-background p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Exportação CSV</h3>
                <p className="text-muted-foreground">
                  Precisa cruzar dados ou enviar para contabilidade? Exporte sua
                  base de clientes completa em formato CSV facilmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IDEAL PARA SECTION */}
        <section
          id="recursos"
          className="py-20 bg-background overflow-hidden border-t"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Left Side: Mobile Screenshot */}
              <div className="relative mx-auto w-full max-w-[260px] aspect-[9/19] rounded-[32px] border-[6px] border-muted bg-black shadow-2xl overflow-hidden flex flex-col transform lg:-rotate-6 hover:rotate-0 transition-transform duration-500">
                {/* Fake Notch */}
                <div className="absolute top-0 inset-x-0 h-5 w-24 mx-auto bg-muted rounded-b-xl z-10" />
                <div className="w-full h-full bg-background flex flex-col text-sm pt-6 overflow-hidden">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">J</div>
                      <span className="font-semibold text-xs">Olá, João</span>
                    </div>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {/* Mobile Content */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/10">
                    <div className="w-full py-1.5 border border-primary/20 text-primary text-center rounded-md font-medium text-[10px] bg-primary/5 uppercase">
                      NOVO EMPRÉSTIMO
                    </div>
                    
                    {/* Card 1 */}
                    <div className="bg-card border rounded-lg p-3 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <span>Total de Juros (Mês)</span>
                        <TrendingUp className="h-3 w-3 text-[#00c48c]" />
                      </div>
                      <span className="font-bold text-lg text-[#00c48c]">R$ 11.700,00</span>
                      <span className="text-[9px] text-[#00c48c]">+100% em relação ao mês passado</span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-card border rounded-lg p-3 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <span>Total de Saídas (Mês)</span>
                        <TrendingUp className="h-3 w-3 text-rose-500" />
                      </div>
                      <span className="font-bold text-lg text-rose-500">R$ 55.000,00</span>
                      <span className="text-[9px] text-rose-500">+1471% em relação ao mês passado</span>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-card border rounded-lg p-3 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <span>Total Entradas (Mês)</span>
                        <TrendingUp className="h-3 w-3 text-[#00c48c]" />
                      </div>
                      <span className="font-bold text-lg text-[#00c48c]">R$ 11.000,00</span>
                      <span className="text-[9px] text-[#00c48c]">+100% em relação ao mês passado</span>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-card border rounded-lg p-3 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <span>Total Circulando</span>
                        <TrendingUp className="h-3 w-3 text-amber-500" />
                      </div>
                      <span className="font-bold text-lg text-amber-500">R$ 58.500,00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Text & Cards */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c48c]/30 text-[#00c48c] w-fit text-sm font-medium">
                  <UserRoundPen className="h-4 w-4" />
                  Feito especialmente para você
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Pensado para quem empresta dinheiro
                </h2>
                <p className="text-lg text-muted-foreground">
                  Nossa plataforma é ideal para:
                </p>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 hover:bg-card transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-4 text-[#00c48c] bg-[#00c48c]/5 group-hover:scale-110 transition-transform">
                      <span className="font-bold text-lg">$</span>
                    </div>
                    <p className="text-foreground/80">
                      Credores que desejam ter controle absoluto sobre as
                      parcelas a receber, juros compostos e atrasos.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 hover:bg-card transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-4 text-[#00c48c] bg-[#00c48c]/5 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <p className="text-foreground/80">
                      Escritórios de fomento que precisam de relatórios
                      detalhados e organização profissional dos recebíveis.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 hover:bg-card transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-4 text-[#00c48c] bg-[#00c48c]/5 group-hover:scale-110 transition-transform">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <p className="text-foreground/80">
                      Agentes autônomos que buscam abandonar as planilhas de
                      Excel e ter um painel completo em tempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VANTAGENS EXCLUSIVAS SECTION */}
        <section id="vantagens" className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c48c]/30 text-[#00c48c] mb-6 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Vantagens para Clientes
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Vantagens Exclusivas para Nossos Clientes
              </h2>
              <p className="text-lg text-muted-foreground">
                Muito além de um simples painel, tenha acesso a ferramentas e
                recursos únicos que permitem a você crescer com segurança e
                antecipar riscos.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Card 1 */}
              <div className="flex flex-col rounded-[32px] border bg-background p-8 lg:p-10 shadow-sm overflow-hidden relative group transition-all hover:shadow-lg">
                <div className="inline-block px-3 py-1 rounded-full bg-[#00c48c]/10 text-[#00c48c] text-xs font-medium w-fit mb-6">
                  Controle de Risco
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Redução de Inadimplência
                </h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm">
                  Receba alertas automáticos e relatórios práticos para tomar
                  decisões antes que o atraso vire prejuízo.
                </p>
                <div className="flex items-center text-[#00c48c] font-medium mb-12">
                  <Link to="/sign-up" className="hover:underline">
                    Comece agora
                  </Link>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>

                <div className="mt-auto w-full bg-card/50 border-t rounded-t-2xl shadow-inner relative overflow-hidden h-64 flex items-center justify-center p-4">
                  {/* Toast Mockup */}
                  <div className="w-full max-w-sm bg-background border border-border shadow-xl rounded-lg p-4 flex items-start gap-4 transform group-hover:scale-105 transition-transform duration-500">
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span className="font-semibold text-sm">Você tem notificações importantes</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">1 cliente com pendências hoje.</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <span className="text-[10px] text-muted-foreground">Agora mesmo</span>
                        <div className="text-xs font-bold text-primary cursor-pointer hover:underline bg-primary/10 px-3 py-1 rounded-md">Ver</div>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col rounded-[32px] border bg-background p-8 lg:p-10 shadow-sm overflow-hidden relative group transition-all hover:shadow-lg">
                <div className="inline-block px-3 py-1 rounded-full bg-[#00c48c]/10 text-[#00c48c] text-xs font-medium w-fit mb-6">
                  Exclusividade
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Gestão de Empréstimos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Acompanhe todos os seus clientes, valores a receber, vencimentos e status de pagamento em uma tabela inteligente.
                </p>
                <div className="flex items-center text-[#00c48c] font-medium mb-12">
                  <Link to="/sign-up" className="hover:underline">
                    Comece agora
                  </Link>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>

                <div className="mt-auto w-full bg-card/50 border-t rounded-t-2xl shadow-inner relative overflow-hidden h-64 p-4 flex flex-col justify-end">
                  {/* Table Mockup */}
                  <div className="w-[110%] bg-background border border-border shadow-2xl rounded-lg overflow-hidden transform translate-y-4 translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                      <h4 className="text-sm font-semibold flex items-center gap-2"><UserRoundPen className="h-4 w-4" /> Empréstimos</h4>
                      <div className="flex gap-2">
                        <div className="h-6 w-24 bg-muted rounded-md" />
                        <div className="h-6 w-16 bg-primary/20 rounded-md" />
                      </div>
                    </div>
                    <div className="w-full text-left text-xs">
                      <div className="grid grid-cols-4 font-semibold text-muted-foreground p-2 border-b">
                        <div>Cliente</div>
                        <div>Valor (R$)</div>
                        <div>Status</div>
                        <div>Vencimento</div>
                      </div>
                      <div className="grid grid-cols-4 p-2 border-b items-center hover:bg-muted/10 transition-colors">
                        <div className="font-medium">João Silva</div>
                        <div>R$ 1.500,00</div>
                        <div><span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[10px] font-bold">Atrasado</span></div>
                        <div className="text-rose-500">20/06/2026</div>
                      </div>
                      <div className="grid grid-cols-4 p-2 border-b items-center hover:bg-muted/10 transition-colors">
                        <div className="font-medium">Maria Souza</div>
                        <div>R$ 3.200,00</div>
                        <div><span className="bg-[#00c48c]/10 text-[#00c48c] px-2 py-0.5 rounded-full text-[10px] font-bold">Em dia</span></div>
                        <div>25/06/2026</div>
                      </div>
                      <div className="grid grid-cols-4 p-2 items-center hover:bg-muted/10 transition-colors">
                        <div className="font-medium">Carlos Mendes</div>
                        <div>R$ 800,00</div>
                        <div><span className="bg-[#00c48c]/10 text-[#00c48c] px-2 py-0.5 rounded-full text-[10px] font-bold">Em dia</span></div>
                        <div>30/06/2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* BENEFÍCIOS SECTION */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c48c]/30 text-[#00c48c] mb-6 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Por que o VeroFlux
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Benefícios de gerenciar com a gente
                </h2>
                <p className="text-lg text-muted-foreground mt-4 max-w-xl">
                  Com uma estrutura clara, sem burocracias, decisões baseadas em
                  dados e tecnologia de ponta, você gere seus empréstimos com
                  segurança e clareza em cada etapa.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-8 rounded-full bg-[#00c48c] hover:bg-[#00c48c]/90 text-white"
                asChild
              >
                <Link to="/sign-up">Começar Teste Grátis</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <div className="flex flex-col p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 transition-colors">
                <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-6 text-[#00c48c] bg-[#00c48c]/5">
                  <span className="font-bold text-sm">%</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Sem Taxas Surpresas</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sem comissões ocultas. Você paga a assinatura e tem todo o
                  lucro líquido e controle nas suas mãos.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 transition-colors">
                <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-6 text-[#00c48c] bg-[#00c48c]/5">
                  <span className="font-bold text-sm">$</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Retorno Inteligente</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Seu capital gerenciado de forma inteligente com cálculo
                  automático de juros compostos e simples.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 transition-colors">
                <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-6 text-[#00c48c] bg-[#00c48c]/5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold mb-3">Segurança Total</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Acesso seguro a todos os seus dados e backups automáticos.
                  Nada se perde, tudo fica registrado.
                </p>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col p-6 rounded-2xl border border-muted bg-muted/10 hover:border-[#00c48c]/50 transition-colors">
                <div className="h-10 w-10 rounded-full border border-[#00c48c]/30 flex items-center justify-center mb-6 text-[#00c48c] bg-[#00c48c]/5">
                  <UserRoundPen className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Acompanhamento Premium
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Relatórios em PDF prontos para envio ao cliente e suporte
                  especializado na palma da mão.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PREÇOS SECTION */}
        <section id="planos" className="py-24 bg-background border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                Planos e Preços
              </h2>
              <p className="text-lg text-muted-foreground">
                Tudo que você precisa por um valor justo e sem surpresas.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col rounded-3xl border-2 border-[#00c48c] bg-background p-8 shadow-xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00c48c] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                  MAIS POPULAR
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-center">
                    Assinatura VeroFlux
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold">R$ 49,90</span>
                    <span className="text-muted-foreground font-medium">
                      /mês
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#00c48c]" />
                    <span>Acesso completo ao sistema</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#00c48c]" />
                    <span>Gestão ilimitada de clientes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#00c48c]" />
                    <span>Empréstimos e parcelas sem limite</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#00c48c]" />
                    <span>Alertas automáticos de atrasos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#00c48c]" />
                    <span>3 dias de teste grátis</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-[#00c48c] hover:bg-[#00c48c]/90 text-white h-12 text-lg rounded-xl font-bold"
                  asChild
                >
                  <Link to="/sign-up">Iniciar Teste Grátis</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              <div className="flex flex-col gap-6 top-24">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c48c]/30 text-[#00c48c] w-fit text-sm font-medium bg-[#00c48c]/5">
                  <MessageCircleQuestion className="h-4 w-4" />
                  FAQ
                </div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                  Perguntas
                  <br />
                  Frequentes
                </h2>
                <p className="text-xl font-medium text-foreground/80 mt-2">
                  Tire suas dúvidas e dê o próximo passo com segurança
                </p>
                <p className="text-muted-foreground text-lg">
                  Aqui você encontrará respostas claras e rápidas para as
                  questões mais comuns sobre nossa plataforma de gestão de
                  empréstimos e recebíveis.
                </p>
              </div>

              <div className="w-full">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="item-1"
                    className="py-2 border-border/50"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#00c48c] transition-colors">
                      Preciso ter experiência prévia com softwares financeiros
                      para começar?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      Não é necessário. O VeroFlux foi desenhado para ser
                      extremamente intuitivo e fácil de usar. Em poucos cliques
                      você cadastra seus clientes, insere os empréstimos e o
                      sistema faz todos os cálculos automaticamente para você.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="py-2 border-border/50"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#00c48c] transition-colors">
                      Qual é o limite de clientes e empréstimos que posso
                      cadastrar?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      Não há limites! Nosso sistema permite que você cadastre
                      quantos clientes e contratos forem necessários, garantindo
                      que a plataforma cresça junto com os seus negócios, sem
                      custos extras surpresas.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="py-2 border-border/50"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#00c48c] transition-colors">
                      Como vocês garantem a segurança dos meus dados e dos meus
                      clientes?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      Utilizamos criptografia de ponta e os mesmos padrões de
                      segurança dos grandes bancos. Além disso, backups diários
                      são realizados de forma automática para garantir que
                      nenhuma informação se perca.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="py-2 border-border/50"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#00c48c] transition-colors">
                      Como funciona o cálculo automático de juros e atrasos?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      Você define as regras do contrato (juros simples ou
                      compostos, taxa de mora e multa). Quando uma parcela
                      vence, o sistema automaticamente atualiza o valor da
                      dívida todos os dias e sinaliza o cliente como
                      Inadimplente no seu painel.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-5"
                    className="py-2 border-border/50"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#00c48c] transition-colors">
                      Que tipo de suporte eu recebo após assinar?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      Você terá acesso ao nosso suporte via WhatsApp e E-mail de
                      segunda a sexta, em horário comercial. Além disso,
                      disponibilizamos um manual completo e vídeos tutoriais
                      dentro da própria plataforma.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-[#00c48c] text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Pronto para profissionalizar seus empréstimos?
            </h2>
            <p className="mx-auto max-w-2xl text-white/90 text-lg mb-10">
              Junte-se a diversos profissionais que já organizaram suas finanças
              e reduziram as dores de cabeça com cobranças.
            </p>
            <Button
              size="lg"
              className="bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white font-semibold h-12 px-8 rounded-full border-0 transition-colors"
              asChild
            >
              <a
                href="https://wa.me/5511921848879?text=Olá,%20gostaria%20de%20fazer%20um%20teste%20gratuito!"
                target="_blank"
                rel="noreferrer"
              >
                Entrar em Contato
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">VeroFlux</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VeroFlux. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
