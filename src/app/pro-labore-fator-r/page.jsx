import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight, TrendingDown, Crosshair } from 'lucide-react';

export const metadata = {
  title: "Qual o Valor Exato do Pró-labore para Atingir o Fator R?",
  description: "A arte de achar o 'ponto doce' do pró-labore sem tirar muito e sem tirar pouco, evitando desastres de IR e pendências federais.",
  alternates: {
    canonical: 'https://fatorr.app.br/pro-labore-fator-r',
  },
};

export default function ProLaborePage() {
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
            Descobrir 'Ponto Doce' ➔
          </a>
        </div>
      </nav>

      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Target size={16} />
          <span>Engenharia Contábil</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Você não sabe o <span className="text-emerald-500">Pró-labore Exato</span> para tirar todo mês (e está perdendo dinheiro).
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Fixar em 1 Salário Mínimo "porque é padrão" cai num abismo tributário. Saiba por que o SaaS FatorR.app fixa a Meta Segura em 29%.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Descobrir Meu Pró-labore Exato <ArrowRight />
        </a>
      </header>
      
      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-3xl mx-auto text-center">
             <h2 className="text-2xl font-black mb-4">A Arte do Sweet Spot (Ponto Doce)</h2>
             <p className="text-slate-500 mb-8">
                Tirar pró-labore demais paga muito IR (Imposto de Renda PJ). Tirar pouco faz cair o Fator R p/ 15,5%. A conta de "1 salário mínimo e o resto dividendo" só vale pra quem não tá no Anexo V. Quem tá no V precisa injetar no Fator R pelo menos 28%. Nós adicionamos mais 1% (29%) pra absorver perrengues da sua empresa faturar a mais no fim do mês!
             </p>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FatorR.app © 2026</p>
      </footer>
    </div>
  );
}
