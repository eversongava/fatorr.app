import React, { useState } from 'react';
import {
TrendingDown,
Mail,
ArrowRight,
Loader2,
CheckCircle2,
ShieldCheck
} from 'lucide-react';

/**
* SaaS Fator R - Auth Page (Magic Link)
* Design: Minimalista, focado em conversão e confiança.
*/

export default function AuthPage() {
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [sent, setSent] = useState(false);

const handleLogin = async (e) => {
e.preventDefault();
setLoading(true);

// Simulação da chamada ao Supabase
// const { error } = await supabase.auth.signInWithOtp({ email })

setTimeout(() => {
setLoading(false);
setSent(true);
}, 2000);
};

if (sent) {
return (
<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-slate-100">
        <div
            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Verifique seu e-mail</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Enviamos um link de acesso para <br /><span className="text-slate-900 font-bold">{email}</span>.
        </p>
        <p className="text-xs text-slate-400">
            Não recebeu? Verifique a pasta de spam ou tente novamente em alguns minutos.
        </p>
    </div>
</div>
);
}

return (
<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
    <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
            <div
                className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-emerald-500/20">
                <TrendingDown className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Fator<span
                    className="text-emerald-500 font-black">R</span></span>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 p-10 md:p-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Bem-vindo de volta</h1>
                <p className="text-slate-400 font-medium">Entre com seu e-mail para acessar o cockpit.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">E-mail
                        Profissional</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="email" required placeholder="exemplo@empresa.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={email} onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl disabled:opacity-50">
                    {loading ?
                    <Loader2 className="animate-spin" /> : 'Entrar via Magic Link'}
                    {!loading &&
                    <ArrowRight size={20} />}
                </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-400">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <p className="text-xs font-medium leading-relaxed">
                        Login seguro e sem senha. Ao entrar, você concorda com nossos Termos e Política de Privacidade.
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Support */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
            Dúvidas? <a href="#" className="text-emerald-600 font-bold hover:underline">Fale com o suporte</a>
        </p>
    </div>
</div>
);
}