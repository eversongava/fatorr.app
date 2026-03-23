'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  TrendingDown,
  Sparkles,
  Laptop,
  Stethoscope,
  HardHat,
  Megaphone,
  Lock,
  Info,
  ChevronRight,
  Loader2,
  ChevronDown
} from 'lucide-react';

/**
 * SaaS Fator R - Landing Page V2.0
 * Melhorias: Faturamento mínimo R$ 5.000, Meta 29%, Textos de "Economia Real".
 * Adicionado: Seção de Preços, Funcionalidades e CTA Final.
 */

export default function App() {
  const router = useRouter();
  const [revenue, setRevenue] = useState(15000);
  const [payroll, setPayroll] = useState(1500);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [savings, setSavings] = useState({
    monthly: 0,
    annual: 0,
    achievedFatorR: false,
    factorRPercentage: 0
  });

  useEffect(() => {
    const factorR = revenue > 0 ? (payroll / revenue) : 0;
    const isOptimal = factorR >= 0.28;

    const taxV = revenue * 0.155;
    const taxIII = revenue * 0.06;

    let netSavings = 0;

    if (isOptimal) {
      // Visão simplificada de Marketing solicitada: Moatrando a real diferença entre Anexo V e Anexo III + INSS ideal.
      // Fixamos o INSS na alíquota ideal de 28% para garantir que a economia líquida NÂO diminua caso ele arraste o slider além do necessário.
      const idealPayroll = revenue * 0.28;
      const idealInssCost = idealPayroll * 0.11;
      
      const currentTaxes = taxIII + idealInssCost;
      netSavings = taxV - currentTaxes;
    }

    setSavings({
      monthly: Math.max(0, netSavings),
      annual: Math.max(0, netSavings) * 12,
      achievedFatorR: isOptimal,
      factorRPercentage: factorR * 100
    });
  }, [revenue, payroll]);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada.');
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Não foi possível iniciar o teste grátis no momento.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/30">
      
      {/* Estilos CSS Nativos Leves para a Aurora Boreal de Fundo */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />

      {/* Wrapping the Nav and Hero inside the Mesh Gradient */}
      <div className="relative w-full overflow-hidden mb-12">
        {/* Camada das Bolhas Animadas Flutuantes (Gradient Mesh) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-emerald-200/50 mix-blend-multiply filter blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-200/50 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-teal-100/60 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
          
          {/* Subtle Grid Pattern Overlay opcional para sensação Tech */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlNGRlNGQiLz48L3N2Zz4=')] opacity-20"></div>
          
          {/* Fade Final suave para a cor nativa da Calculadora */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
        </div>

        {/* Content layer */}
        <div className="relative z-10 pt-6">
          {/* Navegação */}
          <nav className="sticky top-6 z-50 max-w-5xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center rotate-3">
              <TrendingDown className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Fator<span className="text-emerald-500 font-black">R</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Como Funciona</a>
            <a href="#simulador" className="hover:text-slate-900 transition-colors">Simulador</a>
            <a href="#precos" className="hover:text-slate-900 transition-colors">Preços</a>
            <Link href="/login" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-md">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-32 pb-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
          <Sparkles size={14} />
          <span>FEITO PARA O SIMPLES NACIONAL (ANEXO V)</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.0] text-slate-900">
          Pare de rasgar dinheiro pagando <span className="text-red-500 line-through decoration-red-200">15,5%</span> de imposto todo mês.
        </h1>
        <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Descubra como PJs de serviços estão reduzindo a carga tributária para apenas <span className="text-emerald-500 font-bold">6%</span> garantindo o benefício legal do Fator R. Sem burocracia, sem surpresas no fim do mês.
        </p>
        <div className="flex flex-col items-center gap-6">
          <a
            href="#simulador"
            className="group bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-5 rounded-2xl text-xl flex items-center gap-3 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0 cursor-pointer"
          >
            Simular Minha Economia <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </header>
      
        </div> {/* Fim do Content layer */}
      </div> {/* Fim do Wrapper do Mesh Gradient */}

      {/* Como Funciona */}
      <section id="como-funciona" className="px-6 py-32 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Como funciona?</h2>
          <p className="text-slate-500 font-medium italic">Três passos para a sua eficiência fiscal definitiva.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <StepCard number="01" title="Carga de Histórico" description="Conectamos aos seus últimos 12 meses para calcular sua média móvel fiscal com precisão." />
          <StepCard number="02" title="Alerta Preditivo" description="A partir do dia 20 enviamos alertas no WhatsApp com o seu pró-labore sugerido para garantir a economia do mês." />
          <StepCard number="03" title="Instrução Pronta" description="Envie a informação do pro-labore otimizado ao seu contador. Garanta benefício fiscal todo mês." />
        </div>
      </section>

      {/* Simulador Otimizado */}
      <section id="simulador" className="px-6 py-24 bg-slate-100 rounded-[60px] mx-4 duration-500 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">Calcule sua Economia real <br />arrastando os controles.</h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-slate-400 uppercase text-xs tracking-widest">
                  <span>Faturamento Mensal</span>
                  <span className="text-slate-900 font-black">R$ {revenue.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="5000" max="50000" step="500" value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-emerald-500 touch-manipulation"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between font-bold text-slate-400 uppercase text-xs tracking-widest items-center">
                  <span>Sua Projeção de Pró-labore</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] ${savings.achievedFatorR ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                      Fator R: {savings.factorRPercentage.toFixed(1)}%
                    </span>
                    <span className="text-slate-900 font-black text-lg">R$ {payroll.toLocaleString()}</span>
                  </div>
                </div>
                <input
                  type="range" min="0" max={revenue * 0.5} step="100" value={payroll}
                  onChange={(e) => setPayroll(Number(e.target.value))}
                  className="w-full h-3 bg-slate-300 rounded-full appearance-none cursor-pointer accent-indigo-500 touch-manipulation"
                />
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex gap-4">
              <Info className="text-indigo-500 shrink-0" size={20} />
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                <b>A mágica acontece nos 28%:</b> Deslize a barra do Pró-labore até atingir o seu ponto ótimo de Fator R e veja a caixa de economia brilhar.
              </p>
            </div>
          </div>

          {/* Resultado Otimizado Interactive */}
          <div className={`w-full md:w-[450px] rounded-[40px] p-10 text-white shadow-3xl transition-colors duration-700 relative overflow-hidden ${savings.achievedFatorR ? 'bg-emerald-500' : 'bg-slate-900'}`}>
            <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-10">
                <Sparkles size={160} className={savings.achievedFatorR ? 'animate-pulse' : 'hidden'} />
            </div>

            <div className="flex items-center justify-between mb-10 group relative z-50">
              <h3 className={`${savings.achievedFatorR ? 'text-emerald-100' : 'text-slate-400'} font-black uppercase tracking-widest text-xs transition-colors`}>
                Eficiência de Caixa
              </h3>
              <div className="cursor-help relative">
                <Info size={16} className={`${savings.achievedFatorR ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-400'} transition-colors`} />
                
                <div className="absolute right-0 top-6 w-72 bg-slate-900 border border-slate-700 text-xs text-slate-300 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none text-left leading-relaxed">
                  A economia é calculada evitando a perda de faturamento caindo no teto abusivo de <strong className="text-emerald-400">15,5% de imposto (Anexo V)</strong> garantindo matematicamente os <strong className="text-emerald-400">6% de imposto (Anexo III)</strong> através de planejamento inteligente do próprio Pró-labore legal.
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 mb-8 text-center backdrop-blur-md z-10 relative">
              <p className="text-white/80 text-[10px] font-black uppercase mb-2">Economia Mensal Líquida</p>
              
              <p className={`text-6xl font-black tracking-tighter transition-all duration-300 ${savings.achievedFatorR ? 'text-white scale-110 drop-shadow-md' : 'text-slate-500'}`}>
                R$ {savings.monthly.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
              
              {savings.achievedFatorR ? (
                <p className="text-emerald-100 text-xs font-bold mt-6 uppercase tracking-widest">R$ {savings.annual.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ao ano recuperados</p>
              ) : (
                <p className="text-rose-400 text-xs font-bold mt-6 animate-pulse uppercase tracking-widest">⚠️ Arraste para o Fator R ideal</p>
              )}
            </div>

            <a href="#precos" className={`w-full text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer relative z-10 ${savings.achievedFatorR ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
              {savings.achievedFatorR ? 'Garantir esta economia' : 'Libere a Economia'} <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Seção de Preços e Funcionalidades */}
      <section id="precos" className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
          <span>Plano Único</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-16 text-slate-900 leading-tight">Assinatura Única. <br /> Paga-se Sozinha.</h2>

        <div className="bg-white border border-slate-200 p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Lista de Funcionalidades */}
            <div className="space-y-6 text-left">
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Carga de histórico fiscal retroativo" />
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Alertas mensais via WhatsApp" />
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Instrução pronta para Contador" />
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Painel de controle do Fator R" />
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Suporte especializado" />
              <Feature icon={<CheckCircle2 className="text-emerald-500" />} text="Cancelamento em 1 clique" />
            </div>

            {/* Card de Preço e CTA Centralizado */}
            <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="mb-6 flex items-center justify-center gap-1">
                <span className="text-slate-400 font-bold text-2xl">R$</span>
                <span className="text-7xl font-black tracking-tighter text-slate-900">29</span>
                <span className="text-slate-400 font-bold text-2xl">,90/mês</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center gap-3 text-center mb-8 w-full shadow-sm max-w-sm mx-auto">
                <div className="bg-emerald-50 p-3 rounded-full">
                  <CreditCard className="text-emerald-600" size={24} />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm">Cartão necessário para ativar trial</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed px-4">Não cobraremos nada hoje. Terá 30 dias para testar a economia real antes da primeira mensalidade.</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full max-w-sm bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-full text-xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group mx-auto disabled:opacity-70 disabled:hover:scale-100"
              >
                {checkoutLoading ? (
                  <><Loader2 className="animate-spin" /> Aguarde...</>
                ) : (
                  <>Ativar O Meu Teste Grátis <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer SEO & Minimalista */}
      <footer className="px-6 py-20 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center space-y-16">
          <div className="flex items-center gap-3 text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            <Lock size={14} /> Dados Protegidos por SSL & LGPD
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale pointer-events-none mb-4">
            <span className="font-black text-xl italic tracking-tighter">STRIPE</span>
            <span className="font-black text-xl italic tracking-tighter">SUPABASE</span>
            <span className="font-black text-xl italic tracking-tighter">AWS</span>
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left pt-12 border-t border-slate-100 mt-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">Profissões</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/imposto-psicologo" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Psicólogos</Link>
                <Link href="/imposto-medico-pj" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Médicos PJ</Link>
                <Link href="/imposto-dentista" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Dentistas</Link>
                <Link href="/imposto-programador-pj" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Programadores (TI)</Link>
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">Soluções Fiscais</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/anexo-iii-ou-v" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Anexo III vs Anexo V</Link>
                <Link href="/pagar-menos-imposto-simples" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Reduzir impostos (Legal)</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">Guias Oficiais</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/calcular-fator-r" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Guia: Como calcular Fator R</Link>
                <Link href="/pro-labore-fator-r" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Pró-labore de 28% no Simples</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">Plataforma Fatorr</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Login de Pessoas Jurídicas</Link>
                <a href="#simulador" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Simulador de Fator R Grátis</a>
              </nav>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest pt-8 border-t border-slate-50 w-full text-center">
            © 2026 Fatorr.app - Solução Oficial para Profissionais do Simples Nacional. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componentes Auxiliares
function CategoryItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-slate-400 font-bold hover:text-emerald-600 transition-colors">
      <div className="bg-slate-50 p-2 rounded-xl">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <span className="text-emerald-500 font-black text-4xl mb-6 block opacity-20 tracking-tighter italic">{number}</span>
      <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-4 text-slate-700 font-bold text-sm">
      <div className="shrink-0">{icon}</div>
      <span>{text}</span>
    </div>
  );
}

const faqData = [
  {
    question: "O que é exatamente o Fator R?",
    answer: "O Fator R é uma regra do Simples Nacional que permite a profissionais liberais (como programadores, engenheiros e médicos) migrar do Anexo V (15,5%) para o Anexo III (6%), desde que a folha de salários represente pelo menos 28% do faturamento bruto acumulado dos últimos 12 meses."
  },
  {
    question: "Por que vocês usam a meta de 29% e não 28%?",
    answer: "Utilizamos 29% como nossa 'Meta de Segurança'. Isso garante que, se o seu faturamento oscilar ligeiramente para cima no final do mês após o cálculo do Pró-labore, você ainda mantenha o benefício fiscal do Anexo III sem o risco de desenquadramento por frações decimais."
  },
  {
    question: "Eu preciso trocar de contador para usar o sistema?",
    answer: "Não. O FatorR SaaS trabalha em conjunto com o seu contador atual. Nós fornecemos a inteligência preditiva e os cálculos exatos. Você apenas copia a instrução gerada e envia para ele operacionalizar a folha mensalmente."
  },
  {
    question: "Como funciona o trial de 30 dias?",
    answer: "Oferecemos acesso total por 30 dias. Durante este período, você pode carregar seu histórico, simular sua economia e receber seus primeiros alertas. Se decidir que não é para si, pode cancelar com um clique antes da primeira cobrança."
  },
  {
    question: "O sistema é seguro para os meus dados fiscais?",
    answer: "Absolutamente. Utilizamos criptografia SSL de nível bancário e a infraestrutura do Supabase/AWS. Além disso, os pagamentos são processados pelo Stripe, garantindo que os seus dados sensíveis nunca sejam armazenados de forma insegura."
  }
];

function FAQSection() {
  return (
    <section id="faq" className="px-6 py-32 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Dúvidas Frequentes
        </h2>
        <p className="text-slate-500 font-medium italic">
          Tudo o que precisa de saber para garantir a sua economia fiscal.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>

      <div className="mt-16 p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 text-center">
        <p className="text-emerald-800 font-bold mb-4">Ainda tem dúvidas cruciais sobre a contabilidade da sua PJ?</p>
        <a 
          href="https://wa.me/5511976816292?text=Olá,%20acessei%20o%20Fatorr.app%20e%20gostaria%20de%20falar%20com%20um%20especialista%20sobre%20a%20redução%20para%206%25." 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-widest transition-all inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full shadow-lg hover:-translate-y-1 mx-auto"
        >
          Falar com um especialista no WhatsApp
        </a>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-white border transition-all duration-300 rounded-[24px] overflow-hidden ${isOpen ? 'border-emerald-500 shadow-lg shadow-emerald-500/5' : 'border-slate-200 shadow-sm hover:border-emerald-200'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-emerald-700' : 'text-slate-900'}`}>
          {question}
        </span>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
          size={20}
        />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed font-medium">
          {answer}
        </div>
      </div>
    </div>
  );
}
