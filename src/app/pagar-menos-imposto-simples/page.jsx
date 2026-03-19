import React from 'react';
import Link from 'next/link';
import { BadgeDollarSign, ArrowRight, TrendingDown, Target } from 'lucide-react';

export const metadata = {
  title: "Como Pagar Menos Imposto no Simples Nacional (Guia Legal)",
  description: "Entenda táticas e estratégias validadas dentro da receita federal para blindar suas finanças e reduzir a carga no simples.",
  alternates: {
    canonical: 'https://fatorr.app.br/pagar-menos-imposto-simples',
  },
};

export default function PagarMenosImpostoPage() {
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
            Cortar Minha Carga Tributária ➔
          </a>
        </div>
      </nav>

      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <BadgeDollarSign size={16} />
          <span>Inteligência Empresarial</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Guia Absoluto: Como pagar menos imposto no <span className="text-emerald-500">Simples Nacional</span> (O caminho sem riscos).
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Dedique 100% da sua atenção a cruzar a ponte tarifária. Existe apenas uma brecha governamental desenhada unicamente para te livrar da tributação confiscatória do Anexo V. Aponte para a automação do Fator R.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Simule o Percentual Evitado <ArrowRight />
        </a>
      </header>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FatorR.app © 2026. Transformando empresários.</p>
      </footer>
    </div>
  );
}
