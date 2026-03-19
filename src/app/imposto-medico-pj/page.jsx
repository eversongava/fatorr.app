import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Stethoscope, AlertTriangle, CheckCircle2, TrendingDown, Info, Calculator } from 'lucide-react';

export const metadata = {
  title: "Fator R para Médicos PJ: Como Pagar Apenas 6% de Imposto",
  description: "Médicos PJ não precisam pagar 15,5% no Simples Nacional. O Fatorr.app automatiza a blindagem do seu CNPJ médico garantindo o Anexo III (6%).",
  alternates: {
    canonical: 'https://fatorr.app.br/imposto-medico-pj',
  },
};

export default function ImpostoMedicoPage() {
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
          <Stethoscope size={16} />
          <span>Blindagem Tributária para Médicos (CRM)</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
          Plantões médicos valem ouro. Pare de dar <span className="text-red-500">15,5%</span> ao Governo.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Para o médico PJ que tira plantões e emite NF-e das clínicas, o Anexo V é um ladrão silencioso de receitas.
          Ative agora seu direito legal ao Anexo III (6%) com automação inteligente.
        </p>
        
        <a
          href="/#simulador"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
        >
          Simular Ganho Por Plantão <ArrowRight />
        </a>
      </header>

      <section className="bg-white py-20 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 border-l-4 border-red-500 pl-6 mb-12">
            <AlertTriangle className="text-red-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">NF-e Alta vs Sem Funcionários</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Serviços médicos caem diretamente na tributação mais agressiva do Simples Nacional (Anexo V). Um médico que fatura R$ 25.000 em plantões e consultas clínicas deixa quase 4 mil reais apenas em DAS federal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 border-l-4 border-emerald-500 pl-6">
            <ShieldCheck className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-black mb-2">A Tática do Pró-Labore Inteligente</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-4">
                Pela Lei 123/2006, hospitais e clínicas são considerados PJ de Saúde que podem acessar os 6% (Anexo III), caso atestem que pelo menos 28% do que entra no CNPJ vira "salário/pró-labore" do médico.
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800">
                <Info className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-semibold">
                  O Perigo Real: Faturamento médico oscila muito. Fixar o pró-labore no salário mínimo joga sua alíquota pra 15,5%. Colocar lá no alto te mata no Imposto de Renda da Pessoa Física (IRPF).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-6">Por que CRM usa o Fatorr.app?</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Você estudou 6 anos, fez residência, não deve passar a madrugada calculando média móvel de imposto de 12 meses.
        </p>

        <div className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4">Seu Guardião do Anexo III.</h3>
              <ul className="space-y-3 mb-8 text-slate-300 font-medium">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Não precisa trocar de contador. O app gera a instrução.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Alerta exato via WhatsApp para não esquecer do prazo dia 20.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-400 shrink-0" /> Margem de estresse antecipada de faturamento.</li>
              </ul>
              <a
                href="/#simulador"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-4 rounded-full text-lg inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                Simule em Segundos <Calculator size={20}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          FatorR.app © 2026. A ponte inteligente entre a Medicina e a Contabilidade.
        </p>
      </footer>
    </div>
  );
}
