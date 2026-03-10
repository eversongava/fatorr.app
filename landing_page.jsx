'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  TrendingDown,
  Sparkles,
  MousePointer2
} from 'lucide-react';

/**
 * SaaS Fator R - Landing Page (Light Mode Premium)
 * Inspirações: WP Engine (Autoridade) & Typeform (Minimalismo)
 */

export default function LandingPage() {
  const [revenue, setRevenue] = useState(15000);
  const [payroll, setPayroll] = useState(1500);
  const [savings, setSavings] = useState({ monthly: 0, annual: 0, currentTax: 0, optimizedTax: 0 });

  useEffect(() => {
    const taxV = revenue * 0.155;
    const taxIII = revenue * 0.06;

    // Cálculo de folha necessária para atingir 28% (Fator R)
    const requiredPayroll = revenue * 0.28;
    const additionalPayrollCost = Math.max(0, (requiredPayroll - payroll) * 0.275);

    setSavings({
      monthly: Math.max(0, taxV - (taxIII + additionalPayrollCost)),
      annual: Math.max(0, taxV - (taxIII + additionalPayrollCost)) * 12,
      currentTax: taxV,
      optimizedTax: taxIII,
    });
  }, [revenue, payroll]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Navegação - Flutuante e Limpa */}
      <nav className="sticky top-6 z-50 max-w-5xl mx-auto px-6 font-sans">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-emerald-500/30">
              <TrendingDown className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">Fator<span className="text-emerald-500">R</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#simulador" className="hover:text-slate-900 transition-colors">Simulador</a>
            <a href="#precos" className="hover:text-slate-900 transition-colors">Preços</a>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/20">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Autoridade WP Engine */}
      <header className="px-6 pt-32 pb-24 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-10 shadow-lg shadow-emerald-500/10">
          <Sparkles size={14} />
          <span>Inteligência Fiscal para Prestadores</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] text-slate-900">
          Pague <span className="text-emerald-500">6%</span> <br />
          e não <span className="text-slate-300">15,5%.</span>
        </h1>

        <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          O SaaS que monitora o seu faturamento e folha para garantir o <span className="text-slate-900 font-bold underline decoration-emerald-500/30">Anexo III</span>.
          Sem complexidade, sem sustos no fim do mês.
        </p>

        <div className="flex flex-col items-center gap-6 relative z-10">
          <button className="group bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-5 rounded-full text-xl flex items-center gap-3 transition-all shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 active:translate-y-0">
            Começar Trial de 30 Dias <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
            <div className="flex -space-x-2 shadow-sm rounded-full">
              {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />)}
            </div>
            <span>+2.400 profissionais economizando agora</span>
          </div>
        </div>
      </header>

      {/* Simulador - Estilo Typeform */}
      <section id="simulador" className="px-6 py-24 bg-white shadow-2xl shadow-slate-200/50 rounded-[60px] mx-4 border border-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900">Simule o seu ROI.</h2>
                <p className="text-slate-500 text-lg font-medium">Descubra quanto dinheiro está deixando na mesa todos os meses sem o planejamento do Fator R.</p>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between font-black text-slate-400 uppercase text-xs tracking-widest">
                    <span>Faturamento Mensal</span>
                    <span className="text-slate-900 text-base">R$ {revenue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="8000" max="35000" step="500" value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-black text-slate-400 uppercase text-xs tracking-widest">
                    <span>Folha / Pró-labore Atual</span>
                    <span className="text-slate-900 text-base">R$ {payroll.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="0" max={revenue} step="100" value={payroll}
                    onChange={(e) => setPayroll(Number(e.target.value))}
                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-4 p-8 bg-slate-50 rounded-[40px] border border-slate-200 items-start shadow-inner">
                <MousePointer2 className="text-emerald-500 shrink-0 w-8 h-8" />
                <p className="text-slate-600 font-medium leading-relaxed">
                  <b className="text-slate-900 font-black">Como calculamos:</b> Cruzamos a sua receita bruta acumulada com a folha necessária para manter o Fator R acima de 28%, garantindo segurança fiscal.
                </p>
              </div>
            </div>

            {/* Resultados - Navy de Alto Contraste */}
            <div className="w-full md:w-[480px] bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl shadow-slate-900/50 relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calculator size={160} />
              </div>

              <h3 className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-10 relative z-10">Diagnóstico de Economia</h3>

              <div className="space-y-8 mb-12 relative z-10">
                <div className="flex justify-between items-center opacity-60">
                  <span className="font-bold text-lg">Sem Planejamento</span>
                  <span className="font-black line-through italic text-rose-400 text-xl">R$ {savings.currentTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-bold text-xl text-white">Com Fator R</span>
                  <span className="text-4xl font-black tracking-tighter">R$ {savings.optimizedTax.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-10 relative z-10 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-black uppercase tracking-widest mb-3">Economia Mensal Líquida</p>
                <p className="text-7xl font-black text-white leading-none tracking-tighter">R$ {savings.monthly.toLocaleString()}</p>
              </div>

              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-6 rounded-full text-lg transition-all shadow-xl shadow-emerald-500/20 relative z-10 hover:scale-[1.02] active:scale-[0.98]">
                Garantir esta economia
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preços - Transparência Typeform */}
      <section id="precos" className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-16 text-slate-900">Transparência total.</h2>

        <div className="bg-white border border-slate-100 p-12 md:p-16 rounded-[60px] shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="mb-12 relative z-10 text-slate-900">
            <span className="bg-slate-900 text-emerald-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest mb-6 inline-block shadow-lg shadow-slate-900/20">Plano Único</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-400 text-3xl font-bold">R$</span>
              <span className="text-8xl font-black tracking-tighter">29</span>
              <span className="text-slate-400 text-3xl font-bold">,90<span className="text-lg font-medium">/mês</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-14 relative z-10">
            {[
              "Carga de histórico fiscal",
              "Painel de controle Fator R",
              "Alertas via WhatsApp",
              "Suporte especializado",
              "Cancelamento em 1 clique",
              "Instrução para Contador"
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-700 font-bold text-lg">
                <CheckCircle2 className="text-emerald-500" size={24} /> {f}
              </div>
            ))}
          </div>

          <div className="space-y-6 relative z-10">
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-center gap-6 text-left shadow-inner">
              <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100">
                <CreditCard className="text-emerald-500 w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-900 font-black text-base">
                  Cartão necessário para ativar trial
                </p>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Não cobraremos nada hoje. Terá 30 dias para testar e ver a economia real antes da primeira mensalidade.
                </p>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black py-6 rounded-full text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-slate-900/30">
              Ativar O Meu Teste Grátis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-slate-200 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4 text-slate-900">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="bg-emerald-500 w-6 h-6 rounded flex items-center justify-center">
                <TrendingDown size={14} className="text-white" />
              </div>
              <span className="font-black text-lg">FatorR</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs font-medium mx-auto md:mx-0">
              Ajudamos profissionais intelectuais a focarem no que importa enquanto cuidamos da eficiência fiscal.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div className="space-y-4">
              <p className="font-bold text-sm text-slate-900">Produto</p>
              <ul className="text-slate-500 text-sm space-y-2 font-medium">
                <li><a href="#simulador" className="hover:text-emerald-600 transition-colors">Simulador</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm text-slate-900">Empresa</p>
              <ul className="text-slate-500 text-sm space-y-2 font-medium">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider items-center">
          <p>© 2024 FatorR SaaS. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Certificado PCI DSS & LGPD Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
