"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    ShieldCheck,
    TrendingDown,
    ArrowRight,
    Loader2,
    CalendarDays,
    DollarSign,
    Users,
    User,
    Phone,
    Info,
    Lock
} from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [monthsData, setMonthsData] = useState([]);

    // Novos campos de perfil
    const [fullName, setFullName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isNewCompany, setIsNewCompany] = useState(false);

    useEffect(() => {
        async function initOnboarding() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // 1. Tenta buscar o perfil existente
            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, whatsapp, is_new_company')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setFullName(profileData.full_name || '');
                setWhatsapp(profileData.whatsapp || '');
                setIsNewCompany(profileData.is_new_company || false);
            }

            // 2. Tenta buscar histórico fiscal existente
            const { data: fiscalData } = await supabase
                .from('fiscal_data')
                .select('*')
                .eq('user_id', user.id)
                .order('month_year', { ascending: false })
                .limit(12);

            // 3. Gera a base dos últimos 12 meses regressivamente
            const newMonthsData = [];
            const today = new Date();

            for (let i = 0; i < 12; i++) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
                const label = d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '').toUpperCase();

                // Procura se já tem dados salvos para este mês exato
                const existingMonthData = fiscalData?.find(f => f.month_year === monthStr);

                newMonthsData.push({
                    month_year: monthStr,
                    label: label,
                    revenue_rbt: existingMonthData ? existingMonthData.revenue_rbt : '',
                    payroll_fs: existingMonthData ? existingMonthData.payroll_fs : '',
                    is_prediction: i === 0 // O mês atual [0] consideramos como previsão
                });
            }

            setMonthsData(newMonthsData);
            setLoading(false);
        }

        initOnboarding();
    }, [router]);

    const handleInputChange = (index, field, value) => {
        const updated = [...monthsData];
        updated[index][field] = value;
        setMonthsData(updated);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // 1. Salva/Atualiza o perfil do usuário
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    whatsapp: whatsapp,
                    is_new_company: isNewCompany,
                    updated_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            // 2. Prepara os dados fiscais para inserção no banco
            const rowsToInsert = monthsData.map(item => ({
                user_id: user.id,
                month_year: item.month_year,
                revenue_rbt: Number(item.revenue_rbt || 0),
                payroll_fs: Number(item.payroll_fs || 0),
                is_prediction: item.is_prediction
            }));

            const { error: fiscalError } = await supabase
                .from('fiscal_data')
                .upsert(rowsToInsert, { onConflict: 'user_id, month_year' });

            if (fiscalError) throw fiscalError;

            // Sucesso! Redireciona para o painel principal
            router.push('/cockpit');

        } catch (error) {
            console.error("Erro ao salvar dados de onboarding", error);
            // Mostrar a mensagem de erro exata vinda do Supabase
            alert(`Houve um erro ao salvar seu histórico. Detalhes: ${error.message || JSON.stringify(error)}`);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header centralizado */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-emerald-500/20 mx-auto mb-6">
                        <TrendingDown className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Seu Histórico Fiscal</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                        Complete seus dados para ativarmos o motor do Cockpit e calcularmos a sua janela de economia no Simples Nacional.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LADO ESQUERDO: Orientações */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                            <h2 className="text-xl font-black flex items-center gap-3 mb-4">
                                <Info className="text-blue-500" />
                                Orientações Importantes
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed mb-6">
                                Precisamos dos seus últimos 12 meses de faturamento (RBT12) e custos com folha para calcular o Fator R com exatidão.
                            </p>

                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl text-amber-900">
                                <h3 className="font-black mb-2 flex items-center gap-2">
                                    <ShieldCheck size={18} />
                                    Aviso de Fidedignidade
                                </h3>
                                <p className="text-sm font-medium">
                                    Caso não saiba o faturamento e folha exatos dos últimos 12 meses, peça um relatório atualizado ao seu contador! Valores incorretos podem gerar cálculos de impostos equivocados.
                                </p>
                            </div>
                        </div>

                        {/* Toggle Empresa Nova */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 flex items-start gap-4">
                            <div className="pt-1">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isNewCompany}
                                        onChange={(e) => setIsNewCompany(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 flex items-center gap-2">
                                    Empresa Nova (menos de 12 meses)
                                    <div className="group relative">
                                        <Info size={16} className="text-slate-400 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            A proporcionalização do faturamento seguirá a LC 123/2006. (Média aritmética dos meses ativos x 12).
                                        </div>
                                    </div>
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    Ative se o seu CNPJ foi aberto há menos de 1 ano.
                                    Campos em branco serão tratados como R$ 0,00 automaticamente.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* LADO DIREITO: Formulário */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSave} className="bg-white rounded-[40px] shadow-2xl border border-slate-200 p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-slate-100 pb-12">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <User size={14} /> Seu Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Digite seu nome"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Phone size={14} /> WhatsApp (Para Alertas)
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(XX) 9XXXX-XXXX"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="hidden md:grid grid-cols-3 gap-6 text-xs font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-2"><CalendarDays size={14} /> Período</div>
                                    <div className="flex items-center gap-2"><DollarSign size={14} /> Faturamento (R$)</div>
                                    <div className="flex items-center gap-2"><Users size={14} /> Folha / Pró-labore</div>
                                </div>

                                {monthsData.map((data, index) => (
                                    <div key={data.month_year} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl border border-slate-100 md:border-none">
                                        <div className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            {data.label} {index === 0 && <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full ml-2">MÊS ATUAL</span>}
                                        </div>

                                        <div>
                                            <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Faturamento</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.revenue_rbt}
                                                onChange={(e) => handleInputChange(index, 'revenue_rbt', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Folha / Pró-labore</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.payroll_fs}
                                                onChange={(e) => handleInputChange(index, 'payroll_fs', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-5 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50 mb-6"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : 'Salvar e Ver Economia'}
                                    {!saving && <ArrowRight />}
                                </button>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5"><Lock size={14} className="text-emerald-500" /> Criptografia SSL de 256 bits</div>
                                    <div className="hidden sm:block text-slate-300">•</div>
                                    <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Conformidade com LGPD</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
