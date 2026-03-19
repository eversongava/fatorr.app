import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, ShieldAlert, CheckCircle2, TrendingDown, Info, Calculator, HeartPulse } from 'lucide-react';

export const metadata = {
  title: "Imposto para Dentistas PJs no Simples Nacional",
  description: "Reduza o imposto do seu consultório odontológico. Veja como a alíquota de 15,5% do cirurgião-dentista pode cair para 6% garantindo sua margem de lucro.",
  alternates: {
    canonical: 'https://fatorr.app.br/imposto-dentista',
  },
};

export default function ImpostoDentistaPage() {
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
          <HeartPulse size={16} />
          <span>Odontologia e Finanças (CRO)</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Clínica odontológica paga <span className="text-emerald-500">6%</span> ou <span className="text-red-500 line-through">15,5%</span> de Simples Nacional?
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Com insumos cada vez mais caros e laboratórios de prótese corroendo as margens, 
          entenda a regra de ouro que permite ao cirurgião-dentista oxigenar o caixa no Anexo III.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Simular o Desconto Tributário <ArrowRight />
        </a>
      </header>

      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 border-l-4 border-red-500 pl-6 mb-12">
            <ShieldAlert className="text-red-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Matemática Perversa</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Você faz um clareamento de R$ 1.000. Desconta a resina, as fitas, o kit profilático... e depois vem o Leão cobrando R$ 155,00 (15,5% sobre o bruto) por estar no Anexo V. O lucro some do mapa odontológico.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 border-l-4 border-emerald-500 pl-6">
            <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Virada Legal Promovida pelo Fator R</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-4">
                Para quem atua com saúde, a tributação possui uma válvula de escape. Vinculando um Pró-labore oficial acima de 28% do faturamento da clínica, seu CNPJ despenca para os amados 6% finais da guia do DAS. É matemático e irrefutável.
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800">
                <Info className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-semibold">
                  Exemplo de Fôlego: Faturando brutos R$ 18.000 mensais com tratamentos, a redução bruta de impostos vai passar de R$ 16.000 ao longo do seu ano de trabalho!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-6">Mantenha a Cadeira Ocupada, não o Caderno de Contas.</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Fazer a projeção não é fácil. Acertar exatamente o valor ideal cruzando IRPF e INSS sem perder dinheiro requer engenharia tributária. Nós já construímos a engine para você.
        </p>

        <div className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4">Eficiência de Caixa Garantida para Dentistas.</h3>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Monitoramento contínuo em nuvem.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Integração orgânica de avisos diários com seu próprio celular via Zap.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Cálculo blindado via Meta Fatorr 29%.</li>
              </ul>
              <a
                href="/#simulador"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                Veja O Dinheiro Voltando no Simulador <Calculator size={20}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          FatorR.app © 2026. Feito para cirurgiões-dentistas de alta performance.
        </p>
      </footer>
    </div>
  );
}
