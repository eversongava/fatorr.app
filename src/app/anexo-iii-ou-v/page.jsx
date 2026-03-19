import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight, TrendingDown, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: "Anexo III ou Anexo V: A Diferença Chocante no Imposto e o Fator R",
  description: "Entenda a guerra entre o Anexo III (6%) e o Anexo V (15,5%) no Simples Nacional e por que você não precisa trocar de CNAE arriscando crime tributário.",
  alternates: {
    canonical: 'https://fatorr.app.br/anexo-iii-ou-v',
  },
};

export default function AnexoIIIouVPage() {
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
            Ver Qual é o Meu Anexo ➔
          </a>
        </div>
      </nav>

      <header className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <ArrowLeftRight size={16} />
          <span>A Batalha dos Anexos</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Você pertence ao <span className="text-emerald-500">Anexo III</span> ou ao <span className="text-red-500">Anexo V</span>?
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Muitos prestadores de serviço ficam assustados com a carga tributária do Anexo V e acabam buscando alternativas complexas de contabilidade. 
          A boa notícia é que a própria legislação oferece o Fator R: um mecanismo desenhado unicamente para transferir atividades de serviço para o Anexo III de forma técnica, limpa e 100% legal.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Ir Legalmente Para o Anexo III Agora <ArrowRight />
        </a>
      </header>

      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto text-left">
          <h2 className="text-2xl font-black mb-6">A Lei é Clara: O resgate via Fator R</h2>
          <p className="text-slate-500 mb-6">A alavanca mais pesada à disposição no Simples Nacional é o Fator R. Profissionais intelectuais começam em 15,5%. Mas a Receita abriu a cláusula da folha de pagamento de 28%.</p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
              <h3 className="font-black text-red-600 text-xl mb-2">Cruel Anexo V (15,5%)</h3>
              <p className="text-sm text-red-800">Custo inicial altíssimo sem dedução do Fator R ativo.</p>
            </div>
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <h3 className="font-black text-emerald-600 text-xl mb-2">Paraíso Anexo III (6%)</h3>
              <p className="text-sm text-emerald-800">Aplicável apenas cruzando a fronteira de 28% de Fator R.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FatorR.app © 2026. A ponte segura entre anexos tributários.</p>
      </footer>
    </div>
  );
}
