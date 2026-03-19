import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Brain, AlertTriangle, CheckCircle2, TrendingDown, Info, Calculator } from 'lucide-react';

export const metadata = {
  title: "Imposto para Psicólogo no Simples Nacional: Como Pagar Apenas 6%",
  description: "Descubra como o Fatorr.app ajuda psicólogos a saírem do Anexo V (15,5%) e pagarem apenas 6% de imposto legalmente usando o Fator R.",
  alternates: {
    canonical: 'https://fatorr.app.br/imposto-psicologo',
  },
};

export default function ImpostoPsicologoPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar Minimalista */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center rotate-3">
              <TrendingDown className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Fator<span className="text-emerald-500">R</span>
            </span>
          </Link>
          <a href="/#simulador" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
            Calculadora Fator R ➔
          </a>
        </div>
      </nav>

      {/* Hero Section Específica */}
      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Brain size={16} />
          <span>Especial para Psicólogos (CRP)</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Imposto para Psicólogo PJ: Pare de perder <span className="text-red-500">15,5%</span> da sua clínica.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Emitir nota fiscal de serviços de psicologia (Anexo V) leva boa parte do seu faturamento bruto. 
          Descubra como aplicar a <b className="text-slate-900">Regra do Fator R</b> para cair no Anexo III e pagar apenas 6%.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Simular Ganho Para Meu Consultório <ArrowRight />
        </a>
      </header>

      {/* O Problema */}
      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 border-l-4 border-red-500 pl-6 mb-12">
            <AlertTriangle className="text-red-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A armadilha do Anexo V na Psicoterapia</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Você estuda anos, monta o consultório, paga CRP, aluguel, marketing, e quando emite a NF-e para o paciente, o Governo fica com 15,5% do valor bruto. A cada R$ 10.000 faturados, mais de R$ 1.500 vão para o ralo. A boa notícia é que a lei permite reverter isso.
              </p>
            </div>
          </div>

          {/* O Fator R */}
          <div className="flex items-start gap-6 border-l-4 border-emerald-500 pl-6">
            <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Solução Legal: Fator R (A Queda para 6%)</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-4">
                A psicologia é uma atividade amparada pela tributação proporcional do Simples Nacional. Se você declarar um Pró-labore de pelo menos 28% do que fatura nos últimos 12 meses, você é transferido para o Anexo III (6%).
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800">
                <Info className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-semibold">
                  Exemplo Prático: Um psicólogo que fatura R$ 10.000 mensais sai de uma conta de R$ 1.550 (Anexo V) e passa a pagar apenas R$ 600 em imposto (+ custo do próprio pró-labore). Sobram quase R$ 700 líquidos a mais na conta todo mês.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Ferramenta */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-6">O perigo do "cálculo manual"</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Fazer a média móvel de 12 meses do faturamento do consultório numa planilha é desgastante. Se o seu faturamento de terapias oscilar e sua contabilidade errar 1 centavo, você volta para os 15,5% do Anexo V pagando multa retroativa.
        </p>

        <div className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4">Automatize a eficiência financeira da sua clínica hoje.</h3>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Cálculo automático via margem de segurança segura (29%).</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Alertas proativos via WhatsApp no dia 20.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Mensagem pronta para a contabilidade copiar e colar.</li>
              </ul>
              <a
                href="/#simulador"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                Simule Quanto de Dinheiro Tem na Mesa <Calculator size={20}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          FatorR.app © 2026. Ajudando clínicas organizarem seus lucros.
        </p>
      </footer>
    </div>
  );
}
