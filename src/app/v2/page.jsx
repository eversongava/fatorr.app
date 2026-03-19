'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calculator, ShieldCheck, ArrowRight, CheckCircle2,
  TrendingDown, Sparkles, AlertTriangle, Info, Loader2, ChevronRight, Lock
} from 'lucide-react';

export default function V2LandingPage() {
  const router = useRouter();
  const [revenue, setRevenue] = useState(13500);
  const [payroll, setPayroll] = useState(1500);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [savings, setSavings] = useState({
    monthly: 0,
    annual: 0,
  });

  useEffect(() => {
    // Anexo V: 15.5% | Anexo III: 6% + INSS (aprox 11% sobre excedente)
    const taxV = revenue * 0.155;
    const taxIII = revenue * 0.06;
    
    // Meta de 29%
    const targetPayroll = revenue * 0.29;
    const additionalPayrollNeeded = Math.max(0, targetPayroll - payroll);
    const payrollTaxCost = additionalPayrollNeeded * 0.11; // Simplificando para o público

    const optimizedCost = taxIII + payrollTaxCost;
    const totalSavings = Math.max(0, taxV - optimizedCost);

    setSavings({
      monthly: totalSavings,
      annual: totalSavings * 12,
    });
  }, [revenue, payroll]);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Tente novamente mais tarde.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      
      {/* Navbar Minimalista */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center rotate-3">
              <TrendingDown className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Fator<span className="text-emerald-500">R</span>
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors">
              Fazer Login
            </Link>
            <button 
              onClick={handleCheckout} 
              className="bg-slate-900 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Começar Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* BLOCO 1: Hero Section Orientada à Dor Financeira */}
      <header className="px-6 pt-24 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <ShieldCheck size={16} />
          <span>Exclusivo para o Simples Nacional (Anexo V)</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.05] text-slate-900">
          Pare de rasgar dinheiro pagando <span className="text-red-500 line-through decoration-red-200">15,5%</span> todo mês.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          Descubra como PJs de serviços (médicos, psicólogos e devs) estão usando a Lei do Fator R para 
          <b className="text-slate-900"> reduzir a carga tributária para apenas 6%</b>. Sem planilhas e sem dor de cabeça.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#simulador"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
          >
            Simular Minha Economia <ChevronRight />
          </a>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">⭐⭐⭐⭐⭐ Protegendo o caixa de dezenas de CNPJs</p>
      </header>

      {/* BLOCO 2: Exemplo Tangível (Provas Numéricas) */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12 tracking-tight">A Matemática é simples. O Governo não te conta.</h2>
          
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                <p className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-2">Exemplo Fatorr.app</p>
                <h3 className="text-3xl font-black mb-6">Faturamento de R$ 13.500/mês</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-red-500/20 text-red-400 p-1 rounded"><AlertTriangle size={16} /></span>
                    <div>
                      <p className="text-sm font-bold text-slate-300">No Anexo V normal (15,5%)</p>
                      <p className="font-black text-xl text-red-400">R$ 2.092,50 pago na guia</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 mt-6">
                    <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded"><CheckCircle2 size={16} /></span>
                    <div>
                      <p className="text-sm font-bold text-slate-300">Usando o Fatorr (Anexo III 6%)</p>
                      <p className="font-black text-xl text-emerald-400">R$ 810,00 na guia (+INSS)</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 p-8 rounded-2xl flex flex-col justify-center border border-white/10 backdrop-blur-sm text-center">
                <p className="text-slate-300 font-bold mb-2">Dinheiro no seu bolso:</p>
                <p className="text-5xl font-black text-emerald-400 tracking-tighter mb-2">+ R$ 1.050</p>
                <p className="text-slate-400 text-sm">por mês de economia limpa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 3: O Simulador Prático (Lead Capture / Conversão) */}
      <section id="simulador" className="px-6 py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Faça as contas você mesmo.</h2>
          <p className="text-slate-500 font-medium">Veja o peso que sai das suas costas migrando para o Anexo III com o nosso sistema.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between font-bold text-slate-500 text-sm mb-4">
                  <span>Qual o seu Faturamento Médio?</span>
                  <span className="text-slate-900 font-black">R$ {revenue.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="5000" max="40000" step="500" value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex gap-3">
                <Info className="shrink-0" size={20} />
                <p className="text-xs font-medium leading-relaxed">
                  O aplicativo cruza seus últimos 12 meses para encontrar a "Meta Segura de 29%" e gera as instruções para o seu contador.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 relative">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Economia Líquida Mensal</p>
              <p className="text-5xl font-black text-slate-900 mb-6">R$ {Math.round(savings.monthly).toLocaleString('pt-BR')}</p>
              
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70"
              >
                {checkoutLoading ? <><Loader2 className="animate-spin" size={20} /> Carregando...</> : 'Proteger Meu CNPJ Agora'}
              </button>
              <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wider">30 dias grátis. Cancela com 1 clique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO Final: CTA e Rodapé Cópia Padrão */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-black tracking-tight mb-8">Não entregue suas margens ao Leão.</h2>
          <button
            onClick={handleCheckout}
            className="bg-emerald-500 text-white font-black px-8 py-4 rounded-full text-lg shadow-lg hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
          >
            Quero Testar o Sistema <Lock size={18} />
          </button>
          
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4">
            <p>FatorR.app © 2026. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-slate-600">Login</Link>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
