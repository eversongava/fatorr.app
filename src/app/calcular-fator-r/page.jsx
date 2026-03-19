import React from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, TrendingDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Como Calcular o Fator R do Simples Nacional Passo a Passo em 2026",
  description: "Aprenda a fórmula oficial do Fator R. Por que a conta manual é perigosa e como o Fatorr.app te joga aos 6% eliminando as multas fiscais.",
  alternates: {
    canonical: 'https://fatorr.app.br/calcular-fator-r',
  },
};

export default function CalcularFatorRPage() {
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
            Usar Calculadora Oficial ➔
          </a>
        </div>
      </nav>

      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Calculator size={16} />
          <span>Matemática vs Automação</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          A verdade sobre a Fórmula do <span className="text-emerald-500">Fator R</span> em 2026.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Calcular o Fator R na mão exigirá a soma dos últimos 12 meses do seu faturamento e folha. Qualquer erro centesimal te devolve aos cruéis 15,5% do Anexo V.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Deixe a Máquina Calcular para Você <ArrowRight />
        </a>
      </header>

      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 border-l-4 border-red-500 pl-6 mb-12">
            <AlertTriangle className="text-red-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Frustração da Planilha (Custeio e Histórico)</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                A fórmula real é: <code>Fator R = (Folha últimos 12 meses / Receita últimos 12 meses) * 100</code>.<br/> Se passar de 28%, você entra no Anexo III. Mas adivinhe? Seu faturamento não é estático. Uma fatura grande que chega desestabiliza a média toda, e você cai em dívida na hora do fechamento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 border-l-4 border-emerald-500 pl-6">
            <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Ferramenta Definitiva</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-4">
                O Fatorr.app captura os últimos meses, puxa os montantes, aplica a <b>Meta Protetiva de 29%</b>, e cospe o número exato blindado de Pró-labore que o seu contador tem que passar para o eSocial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FatorR.app © 2026. Feito para CNPJs do Simples.</p>
      </footer>
    </div>
  );
}
