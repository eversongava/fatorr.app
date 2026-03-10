import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// @ts-ignore
const ZAPI_INSTANCE_URL = Deno.env.get('ZAPI_INSTANCE_URL') || '';
// @ts-ignore
const ZAPI_CLIENT_ID = Deno.env.get('ZAPI_CLIENT_ID') || '';
// @ts-ignore
const DB_URL = Deno.env.get('DB_URL') || '';
// @ts-ignore
const DB_SERVICE_ROLE_KEY = Deno.env.get('DB_SERVICE_ROLE_KEY') || '';

// Configuração do Supabase Client com Service Role (Bypass RLS)
const supabase = createClient(DB_URL, DB_SERVICE_ROLE_KEY);

// Função auxiliar genérica para disparar pela Z-API
async function sendWhatsAppMessage(phone: string, text: string) {
    if (!ZAPI_INSTANCE_URL || !ZAPI_CLIENT_ID) {
        console.error("Z-API credenciais ausentes.");
        return false;
    }

    // Formata telefone (remove não-numéricos) e adiciona o país se não tiver
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 11 || formattedPhone.length === 10) formattedPhone = '55' + formattedPhone;

    try {
        const response = await fetch(`${ZAPI_INSTANCE_URL}/send-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-Token': ZAPI_CLIENT_ID
            },
            body: JSON.stringify({
                phone: formattedPhone,
                message: text
            })
        });

        return response.ok;
    } catch (e) {
        console.error("Erro no fetch da Z-API:", e);
        return false;
    }
}

// Log da notificação no banco
async function logNotification(userId: string, type: string, monthYear: string | null) {
    await supabase.from('notification_logs').insert({
        user_id: userId,
        notification_type: type,
        ...(monthYear ? { month_year: monthYear } : {})
    });
}

// Helper to calculate Fator R metrics with Motor Proporcional
function calculateMetricsForNotifications(fiscalHistory: any[], isNewCompany = false) {
    const MINIMUM_WAGE = 1412.00;
    const TARGET_FACTOR = 0.29;

    if (!fiscalHistory || fiscalHistory.length === 0) return null;

    const pastHistory = fiscalHistory.slice(1);
    const currentMonth = fiscalHistory[0];

    let pastRevenue = 0;
    let pastPayroll = 0;
    let wasProportionalCalculated = false;

    if (isNewCompany) {
        const activePastMonths = pastHistory.filter(item => Number(item.revenue_rbt || 0) > 0 || Number(item.payroll_fs || 0) > 0);
        const n = activePastMonths.length;

        if (n > 0 && n < 11) {
            const sumPastRevenue = activePastMonths.reduce((sum, item) => sum + Number(item.revenue_rbt || 0), 0);
            const sumPastPayroll = activePastMonths.reduce((sum, item) => sum + Number(item.payroll_fs || 0), 0);

            pastRevenue = (sumPastRevenue / n) * 11;
            pastPayroll = (sumPastPayroll / n) * 11;
            wasProportionalCalculated = true;
        } else {
            pastRevenue = pastHistory.reduce((sum, item) => sum + Number(item.revenue_rbt || 0), 0);
            pastPayroll = pastHistory.reduce((sum, item) => sum + Number(item.payroll_fs || 0), 0);
        }
    } else {
        pastRevenue = pastHistory.reduce((sum, item) => sum + Number(item.revenue_rbt || 0), 0);
        pastPayroll = pastHistory.reduce((sum, item) => sum + Number(item.payroll_fs || 0), 0);
    }

    const currentRevenue = Number(currentMonth.revenue_rbt || 0);
    const totalRevenue = pastRevenue + currentRevenue;

    if (totalRevenue === 0) return null;

    const targetTotalPayroll = totalRevenue * TARGET_FACTOR;
    let requiredProLabore = targetTotalPayroll - pastPayroll;

    if (requiredProLabore < MINIMUM_WAGE) {
        requiredProLabore = MINIMUM_WAGE;
    }

    const projectedTotalPayroll = pastPayroll + requiredProLabore;
    const maxTotalRevenue = projectedTotalPayroll / 0.28;

    // VALOR_ECONOMIA: Diferença entre Anexo V (15,5%) e Anexo III (6%) - INSS (11%)
    const grossEconomy = currentRevenue * 0.095;
    const extraProLabore = Math.max(0, requiredProLabore - MINIMUM_WAGE);
    const inssCost = extraProLabore * 0.11;
    let valorEconomia = grossEconomy - inssCost;
    if (valorEconomia < 0) valorEconomia = 0;

    // Faturamento Maximo antes de cair do 28%:
    const fatMax = maxTotalRevenue - totalRevenue; // Quanto pode faturar ainda

    return {
        valor: requiredProLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        valorEconomia: valorEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fatMax: Math.max(0, fatMax).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        wasProportionalCalculated
    };
}

serve(async (req: any) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthYearStr = startOfMonth.toISOString().split('T')[0];
        const dayOfMonth = today.getDate();

        // 1. Puxa todos os usuários ativos com WhatsApp
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, full_name, whatsapp, is_new_company')
            .eq('subscription_status', 'active')
            .not('whatsapp', 'is', null);

        if (usersError) throw usersError;

        let sentCount = 0;

        for (const u of users) {
            // Lógica: Welcome Message para novos usuários (verifica se já enviamos)
            const { count: welcomeCount } = await supabase.from('notification_logs')
                .select('*', { count: 'exact' })
                .eq('user_id', u.id)
                .eq('notification_type', 'welcome');

            if (welcomeCount === 0) {
                const msg = `Bem-vindo ao Fatorr.app, *${u.full_name}*! Conte com nossa tecnologia para economizar em impostos o ano todo! Obrigado`;
                const success = await sendWhatsAppMessage(u.whatsapp, msg);
                if (success) {
                    await logNotification(u.id, 'welcome', null);
                    sentCount++;
                }
                // Se mandou welcome hoje, pode pular as demais notificações do dia para evitar spam
                continue;
            }


            // 2. Busca o histórico fiscal para o usuário (até 12 meses)
            const { data: fiscalDataList } = await supabase
                .from('fiscal_data')
                .select('is_prediction, instruction_copied_at, revenue_rbt, payroll_fs, month_year')
                .eq('user_id', u.id)
                .order('month_year', { ascending: false })
                .limit(12);

            if (!fiscalDataList || fiscalDataList.length === 0) continue;

            const currentMonthData = fiscalDataList[0];
            const isCurrentMonth = currentMonthData.month_year === currentMonthYearStr;
            const isPrediction = isCurrentMonth ? currentMonthData.is_prediction : false;

            // Se não for o mês atual no topo, algo está errado (usuário não acessou e gerou o mês ainda)
            if (!isCurrentMonth) continue;

            const isNewCompany = u.is_new_company === true;
            const metrics = calculateMetricsForNotifications(fiscalDataList, isNewCompany);

            // Lógica: "Dia 20" - Lembrete (Planejamento Precoce)
            if (dayOfMonth === 20 && isPrediction === true) {
                const type = 'day_20';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0) {
                    const msg = `Olá, *${u.full_name}*! 🚀 Já calculou a sua economia deste mês? Informe a sua previsão de faturamento no Cockpit para garantirmos o imposto de 6% (Anexo III) em vez de 15,5%.`;
                    const success = await sendWhatsAppMessage(u.whatsapp, msg);
                    if (success) {
                        await logNotification(u.id, type, currentMonthYearStr);
                        sentCount++;
                    }
                }
            }

            // Lógica: "Dia 25" - Urgência (Alerta de Urgência)
            if (dayOfMonth === 25 && isPrediction === true) {
                const type = 'day_25';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0 && metrics) {
                    let msg = `Olá ${u.full_name}! Faltam 24h para definir seu Pró-labore. Sua economia estimada este mês é de R$ ${metrics.valorEconomia}. Garanta seu imposto de 6% acessando o Cockpit.`;

                    if (metrics.wasProportionalCalculated) {
                        msg += ` (O cálculo seguiu a média dos meses ativos da sua empresa nova).`;
                    }

                    const success = await sendWhatsAppMessage(u.whatsapp, msg);
                    if (success) {
                        await logNotification(u.id, type, currentMonthYearStr);
                        sentCount++;
                    }
                }
            }

            // Lógica: "Dia 26" - Reforço de Confiança (Após Copiar para Contador)
            if (dayOfMonth === 26 && currentMonthData.instruction_copied_at !== null) {
                const type = 'copy_accountant';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0 && metrics) {
                    const msg = `Tudo pronto! Sua instrução de Pró- Labore R$ ${metrics.valor} foi copiada. Com este valor, você está seguro mesmo que seu faturamento aumente mais R$ ${metrics.fatMax}. Boa economia! ✅`;
                    const success = await sendWhatsAppMessage(u.whatsapp, msg);
                    if (success) {
                        await logNotification(u.id, type, currentMonthYearStr);
                        sentCount++;
                    }
                }
            }
        }

        return new Response(JSON.stringify({ status: 'ok', sent: sentCount }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        console.error("Erro na Edge Function ZAPI:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
