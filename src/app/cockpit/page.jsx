"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calculateFiscalStrategy } from '@/lib/fiscal-calculations';
import {
    Copy,
    CheckCircle2,
    TrendingDown,
    Calculator,
    Loader2,
    AlertCircle,
    Info,
    CreditCard,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';

export default function CockpitPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isNewCompany, setIsNewCompany] = useState(false);
    const [subStatus, setSubStatus] = useState('active'); // fallback otimista até o fetch
    const [history, setHistory] = useState([]);
    const [projectedRevenue, setProjectedRevenue] = useState('');
    const [results, setResults] = useState({
        totalRevenue: 0,
        totalPayroll: 0,
        requiredProLabore: 0,
        currentFactorR: 0,
        wasProportionalCalculated: false
    });
    const [copied, setCopied] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        async function loadData() {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/login');
                return;
            }

            setUser(user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('is_new_company, stripe_subscription_status')
                .eq('id', user.id)
                .single();

            const newCompanyFlag = profileData?.is_new_company || false;
            setIsNewCompany(newCompanyFlag);
            
            // Assume active if null (for early beta testers) or strictly check
            setSubStatus(profileData?.stripe_subscription_status || 'active');

            const { data: fiscalData, error: dbError } = await supabase
                .from('fiscal_data')
                .select('*')
                .eq('user_id', user.id)
                .order('month_year', { ascending: false })
                .limit(12);

            if (dbError) {
                console.error('Erro ao buscar dados fiscais', dbError);
                setLoading(false);
            } else {
                if (fiscalData && fiscalData.length > 0) {
                    setHistory(fiscalData);
                    setProjectedRevenue(fiscalData[0].revenue_rbt || '');
                    const calculation = calculateFiscalStrategy(fiscalData, newCompanyFlag);
                    setResults(calculation);
                    setLoading(false);
                } else {
                    router.replace('/onboarding');
                }
            }
        }

        loadData();
    }, [router]);

    const handleRevenueBlur = () => {
        if (history.length === 0) return;

        const updatedHistory = [...history];
        updatedHistory[0] = {
            ...updatedHistory[0],
            revenue_rbt: Number(projectedRevenue) || 0
        };

        const calculation = calculateFiscalStrategy(updatedHistory, isNewCompany);
        setResults(calculation);
    };

    const handleCopy = async () => {
        const text = `Olá! Solicito que o meu Pró-labore seja emitido no mês corrente no valor exato de R$ ${results.requiredProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, para manter o enquadramento no Anexo III do Simples Nacional com a margem de segurança de 29% (1% de tolerância). Att, ${user?.email}`;

        // Toast.promise para simular feedback visual de processamento enquanto salvamos tudo no banco
        toast.promise(
            navigator.clipboard.writeText(text).then(async () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);

                if (history.length > 0 && user) {
                    const currentMonth = history[0];
                    await supabase
                        .from('fiscal_data')
                        .update({ 
                            instruction_copied_at: new Date().toISOString(),
                            revenue_rbt: Number(projectedRevenue) || 0,
                            payroll_fs: results.requiredProLabore
                        })
                        .eq('user_id', user.id)
                        .eq('month_year', currentMonth.month_year);
                }
            }),
            {
                loading: 'Calculando faturamento e preparando instrução...',
                success: 'Pronto! A instrução foi copiada. Agora é só colar para o seu contador.',
                error: 'Erro ao copiar a mensagem.',
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
            </div>
        );
    }
    
    // Função para chamar o Portal do Cliente
    const handleCustomerPortal = async () => {
        toast.loading('Abrindo portal seguro do Stripe...', { id: 'portal' });
        try {
            const res = await fetch('/api/portal', { method: 'POST' });
            if (!res.ok) throw new Error();
            const data = await res.json();
            window.location.href = data.url;
        } catch (e) {
            toast.error('Erro ao acessar o portal financeiro.', { id: 'portal' });
        }
    };

    if (subStatus === 'past_due' || subStatus === 'canceled' || subStatus === 'unpaid') {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-[32px] flex items-center justify-center mb-8 rotate-3 shadow-xl shadow-red-500/10">
                    <Lock className="text-red-500 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Acesso Bloqueado</h2>
                <p className="text-slate-500 mb-8 max-w-md leading-relaxed font-medium">
                    Sua assinatura FatorR encontra-se inativa ou com o pagamento pendente. Regularize seu plano para recuperar o acesso instantâneo ao seu cockpit tributário.
                </p>
                <button
                    onClick={handleCustomerPortal}
                    className="bg-slate-900 text-white font-black px-8 py-5 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                    <CreditCard size={20} /> Regularizar Assinatura
                </button>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-6" />
                <h2 className="text-2xl font-black text-slate-900 mb-2">Nenhum dado fiscal encontrado</h2>
                <p className="text-slate-500 mb-8 max-w-sm text-center">
                    Para ver o seu Fator R, precisamos do carregamento inicial do seu histórico contábil.
                </p>
                <button
                    onClick={() => router.push('/onboarding')}
                    className="bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all">
                    Iniciar Onboarding
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-emerald-500/20">
                            <TrendingDown className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">Cockpit</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCustomerPortal}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <CreditCard size={16} /> Assinatura
                        </button>
                        <button
                            onClick={() => router.push('/onboarding')}
                            className="text-sm font-bold text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors hidden sm:block"
                        >
                            Editar Histórico
                        </button>
                        <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hidden md:block">
                            {user?.email}
                        </div>
                    </div>
                </header>

                {results.totalRevenue === 0 ? (
                    <div className="bg-amber-50 text-amber-600 border border-amber-200 p-6 rounded-[40px] mb-8 flex items-start gap-4 shadow-sm">
                        <AlertCircle className="shrink-0 mt-1" />
                        <div>
                            <h3 className="font-black text-lg">Faturamento zerado detectado</h3>
                            <p className="font-medium text-sm mt-1">Nenhuma ação necessária para manter o Fator R neste cenário pois sem receita tributável a folha não será diluída de forma efetiva no cálculo da RFB nesta proporção.</p>
                        </div>
                    </div>
                ) : null}

                {/* Resumo Motor Proporcional Informativo */}
                {results.wasProportionalCalculated && (
                    <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-6 rounded-[40px] mb-8 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Info size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg mb-1">Motor Proporcional Ativo</h3>
                            <p className="font-medium text-sm leading-relaxed text-emerald-800">
                                Como sua empresa possui menos de 12 meses de faturamento contábil contínuo, estamos utilizando o método de cálculo de média aritmética proporcional da Receita Federal (previsto na LC 123/2006). Projetamos o seu volume atual para 12 meses (RBT12 e Folha12) e definimos a métrica alvo.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Coluna 1: Gráfico e Resumo */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Fator R Realizado */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fator R Realizado</h3>
                            <p className="text-sm font-medium text-slate-500 mb-4 leading-relaxed">Considerando histórico vigente (sem simulador).</p>
                            <div className={`text-4xl font-black tracking-tighter ${results.currentFactorR >= 28 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {results.currentFactorR.toFixed(2)}%
                            </div>
                        </div>

                        {/* Fator R Projetado */}
                        <div className="bg-slate-900 p-8 rounded-[40px] shadow-lg border border-slate-800 text-white relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 text-emerald-500/20 rotate-12">
                                <TrendingDown size={100} />
                            </div>
                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 relative z-10">Fator R META</h3>
                            <p className="text-sm font-medium text-slate-400 mb-4 leading-relaxed relative z-10">Com o pró-labore seguro e mitigado.</p>
                            <div className="text-4xl font-black tracking-tighter text-white relative z-10">
                                {results.projectedFactorR?.toFixed(2) || '0.00'}%
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Base de Cálculo RBT12</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Faturamento Base</p>
                                    <p className="text-xl font-black text-slate-900">R$ {results.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Folha Base</p>
                                    <p className="text-xl font-black text-slate-900">R$ {results.totalPayroll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Ações do Mês */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                                    <Calculator className="text-emerald-500 w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter">Estratégia do Mês Atual</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Input Editável */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Faturamento (R$)</label>
                                    <input
                                        type="number"
                                        value={projectedRevenue}
                                        onChange={(e) => setProjectedRevenue(e.target.value)}
                                        onBlur={handleRevenueBlur}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-xl"
                                    />
                                    <p className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> Previsão de entrada de Notas Fiscais
                                    </p>
                                </div>

                                {/* Resultado */}
                                <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 relative overflow-hidden">
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2 relative z-10">Pró-labore Necessário</p>
                                    <p className="text-4xl font-black tracking-tighter text-slate-900 relative z-10">
                                        R$ {results.requiredProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            {/* Indicador de Confiança */}
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8 flex items-start gap-4">
                                <Info className="text-slate-400 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 mb-1">Gordura Financeira (29% Meta)</h3>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed mb-3">
                                        O pró-labore gerado contempla o fator da lei 28% e nós adicionamos +1% de gordura livre de imposto para lhe dar flexibilidade.
                                    </p>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-medium text-slate-800">
                                            O faturamento deste mês ainda pode subir mais <strong className="text-xl font-black block mt-1 text-emerald-600">R$ {results.revenueTolerance?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                            além da previsão informada sem que você corra o risco de ir para o Anexo V (15,5%).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instrução Contador */}
                            <div className="bg-slate-900 rounded-[40px] p-8">
                                <h3 className="text-sm font-black tracking-tight text-white mb-4 flex items-center justify-between">
                                    <span>Instrução para Contador</span>
                                    {copied && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 size={14} /> Copiado!</span>}
                                </h3>

                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-6 relative group">
                                    <p className="text-slate-300 font-medium text-sm leading-relaxed pr-10">
                                        Olá! Solicito que o meu Pró-labore seja emitido no mês corrente no valor exato de <strong className="text-white">R$ {results.requiredProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>, para manter o enquadramento no Anexo III do Simples Nacional com a margem de segurança de 29% (1% de tolerância). Att, {user?.email}
                                    </p>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-xl text-md flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                >
                                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    <span className="uppercase tracking-wide">
                                        {copied ? 'Mensagem Copiada!' : 'Fechar mês e gerar instrução para contador'}
                                    </span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Sucesso */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl transform transition-all">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Mês Fechado! 🎉</h3>
                        <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                            Sua instrução foi gerada e os valores da simulação foram salvos automaticamente no seu histórico.<br/><br/>
                            <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold inline-block mt-2">Dica valiosa:</span><br/>
                            <span className="text-slate-500 text-xs block mt-2">Você sempre pode editar seu histórico caso o valor real das suas notas mude até o fim do mês.</span>
                        </p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            Entendi, fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
