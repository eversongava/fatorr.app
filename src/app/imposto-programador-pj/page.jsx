import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Laptop, TerminalSquare, CheckCircle2, TrendingDown, Info, Calculator } from 'lucide-react';

export const metadata = {
  title: "Programador PJ no Simples Nacional: Como Pagar Apenas 6% usando o Fator R",
  description: "Desenvolvedores e profissionais de TI podem automatizar sua redução tributária saindo do terrível Anexo V e caindo para o Anexo III legalmente.",
  alternates: {
    canonical: 'https://fatorr.app.br/imposto-programador-pj',
  },
};

export default function ImpostoProgramadorPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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

      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Laptop size={16} />
          <span>Contabilidade para Devs e TI</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Você automatiza tudo, mas deixa <span className="text-red-500">15,5%</span> do seu código de imposto?
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Dev quer código limpo e financeiro automatizado. O Anexo V é um terrível gargalo ("memory leak") contábil para serviços de TI.
          Otimize sua empresa para 6% com a matemática do Fator R.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Executar Simulação de Ganhos <ArrowRight />
        </a>
      </header>

      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 border-l-4 border-red-500 pl-6 mb-12">
            <TerminalSquare className="text-red-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Arquitetura Falha do Anexo V</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Desenvolvedores seniores ou PJ de tech geral vendem propriedade intelectual (horas de teclado). A Receita cobra caro: 15,5% no famigerado Anexo V do Simples Nacional caso sua empresa não declare custos atrelados à Folha.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 border-l-4 border-emerald-500 pl-6">
            <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">O Patch de Resolução (Anexo III)</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-4">
                Desenvolvedores PJ raramente têm funcionários. Portanto, toda aquela % tributária se resolve ativando a variável de "Segurança" via Pró-labore oficial acima de 28% nos últimos 12 meses. O famoso "Fator R" de redução. A alíquota é repassada forçadamente para 6%.
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800">
                <Info className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-semibold">
                  Otimização no Back-End: Uma NF-e de prestação de serviços como DEV PJ no valor de C$ 15.000 mês sem o fator custa mais de ~R$ 2.300 ao leão. Com o Fator R otimizado, sobra um "commit" de 12 mil na contra partida anual em caixa real de economia financeira.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-6">Uma API Visual Pura. Pura Lógica. Nada de Planilhas.</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Fazer queries e somar faturamento não precisaria doer. O Fatorr.app roda sua "Stack" inteira de análise no Cockpit e injeta a resposta matemática pro seu app do WhatsApp automaticamente.
        </p>

        <div className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4">Automatize sua rotina fiscal. Em 3 cliques você resolve sua eficiência financeira.</h3>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Regra do sweet-spot com Safety Net (29%).</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Webhooks de aviso via zap dia 20 para planejamento predativo.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Texto de payload pronto pra contabilidade ("Copy+Paste").</li>
              </ul>
              <a
                href="/#simulador"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                Injetar Código Fonte Fator R <Calculator size={20}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          FatorR.app © 2026. A ponte segura entre os bytes e a contabilidade.
        </p>
      </footer>
    </div>
  );
}
