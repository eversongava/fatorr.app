// @ts-ignore: Deno runtime URL import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno runtime URL import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// @ts-ignore: Deno is available in Edge Runtime
const DB_URL = Deno.env.get('DB_URL') || '';
// @ts-ignore: Deno is available in Edge Runtime
const DB_SERVICE_ROLE_KEY = Deno.env.get('DB_SERVICE_ROLE_KEY') || '';

// Configuração do Supabase Client com Service Role (Bypass RLS)
const supabase = createClient(DB_URL, DB_SERVICE_ROLE_KEY);

// Função auxiliar genérica para disparar pela Z-API
async function sendWhatsAppMessage(phone: string, text: string) {
    const ZAPI_INSTANCE_URL = Deno.env.get('ZAPI_INSTANCE_URL') || '';
    const ZAPI_CLIENT_ID = Deno.env.get('ZAPI_CLIENT_ID') || '';

    if (!ZAPI_INSTANCE_URL || !ZAPI_CLIENT_ID) {
        console.error("Z-API credenciais ausentes.");
        return false;
    }

    // Formata telefone (remove não-numéricos) e adiciona o país se não tiver
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 11 || formattedPhone.length === 10) formattedPhone = '55' + formattedPhone;

    let baseUrl = ZAPI_INSTANCE_URL.trim();
    if (baseUrl.endsWith('/send-text')) baseUrl = baseUrl.replace('/send-text', '');
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    
    const targetUrl = `${baseUrl}/send-text`;
    console.log(`[Z-API Debug] Fetching: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
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

        const respText = await response.text();
        console.log(`[Z-API Response for ${formattedPhone}]: ${response.status} - ${respText}`);

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
function calculateMetricsForNotifications(fiscalHistory: Record<string, unknown>[], isNewCompany = false) {
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

    // Regra Administrativa: O Pró-labore não pode ultrapassar o teto do faturamento do mês vigente
    if (requiredProLabore > currentRevenue) {
        requiredProLabore = currentRevenue;
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

serve(async (_req: Request) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthYearStr = startOfMonth.toISOString().split('T')[0];
        const dayOfMonth = today.getDate();

        // 1. Puxa todos os usuários ativos com WhatsApp
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, full_name, whatsapp, is_new_company')
            .in('subscription_status', ['active', 'trial'])
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
                    await logNotification(u.id, 'welcome', currentMonthYearStr);
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
            const isPrediction = isCurrentMonth ? currentMonthData.is_prediction : true;
            const instructionCopiedAt = isCurrentMonth ? currentMonthData.instruction_copied_at : null;

            const isNewCompany = u.is_new_company === true;
            const metrics = calculateMetricsForNotifications(fiscalDataList, isNewCompany);

            // Lógica: "Dia 20" - Lembrete (Planejamento Precoce)
            if (dayOfMonth === 20 && isPrediction === true && instructionCopiedAt === null) {
                const type = 'day_20';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0) {
                    const msg = `Olá, *${u.full_name}*! 🚀 Já calculou a sua economia deste mês? Informe a sua previsão de faturamento no Cockpit Fatorr para garantirmos o imposto menor (Anexo III) em vez dos cruéis 15,5%.`;
                    const success = await sendWhatsAppMessage(u.whatsapp, msg);
                    if (success) {
                        await logNotification(u.id, type, currentMonthYearStr);
                        sentCount++;
                    }
                }
            }

            // Lógica: "Dia 25" - Urgência (Alerta de Urgência)
            if (dayOfMonth === 25 && isPrediction === true && instructionCopiedAt === null) {
                const type = 'day_25';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0) {
                    let msg = '';
                    if (!isCurrentMonth || Number(currentMonthData.revenue_rbt || 0) === 0) {
                        msg = `Olá ${u.full_name}! Faltam 24h para definir seu Pró-labore. Vimos que você ainda não simulou sua previsão no aplicativo! Acesse o Cockpit URGENTE para o seu contador não enviar impostos no Anexo V (15,5%).`;
                    } else if (metrics) {
                        msg = `Olá ${u.full_name}! Faltam 24h para definir seu Pró-labore. Sua economia estimada este mês é de R$ ${metrics.valorEconomia}. Garanta seu imposto de 6% gerando a instrução no Cockpit.`;
                        if (metrics.wasProportionalCalculated) {
                            msg += ` (O cálculo seguiu a média dos meses ativos da sua empresa nova).`;
                        }
                    }

                    if (msg !== '') {
                        const success = await sendWhatsAppMessage(u.whatsapp, msg);
                        if (success) {
                            await logNotification(u.id, type, currentMonthYearStr);
                            sentCount++;
                        }
                    }
                }
            }

            // Lógica: "Dia 26" - Reforço de Confiança (Após Copiar para Contador)
            if (dayOfMonth === 26 && instructionCopiedAt !== null) {
                const type = 'copy_accountant';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0 && metrics) {
                    let msg = `Tudo pronto! Sua instrução de Pró-Labore R$ ${metrics.valor} foi despachada para o contador. Com este valor, você está seguro mesmo que seu faturamento ultrapasse a previsão em mais R$ ${metrics.fatMax}. Boa economia! ✅`;
                    msg += `\n\n📌 *Dica:* Confirme sempre no fechamento do mês se as Notas Fiscais reais bateram com as suas previsões. Se o valor mudar, atualize o Histórico Fatorr para manter seu simulador hiper preciso!`;
                    
                    const success = await sendWhatsAppMessage(u.whatsapp, msg);
                    if (success) {
                        await logNotification(u.id, type, currentMonthYearStr);
                        sentCount++;
                    }
                }
            }

            // Lógica: "Dia 26" - Alerta Máximo (Para quem AINDA NÃO Copiou para o Contador)
            if (dayOfMonth === 26 && isPrediction === true && instructionCopiedAt === null) {
                const type = 'day_26_urgent';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0) {
                    let msg = '';
                    if (!isCurrentMonth || Number(currentMonthData.revenue_rbt || 0) === 0) {
                        msg = `ALERTA MÁXIMO, *${u.full_name}*! 🚨 Hoje é o prazo final para definir seu Pró-labore. Vimos que você ainda não simulou sua previsão no aplicativo! Acesse o Cockpit Fatorr AGORA para o seu contador não enviar impostos no Anexo V (15,5%).`;
                    } else if (metrics) {
                        msg = `ALERTA MÁXIMO, *${u.full_name}*! 🚨 Hoje é o prazo final para instruir seu contador. Sua economia estimada este mês é de R$ ${metrics.valorEconomia}. Acesse o Cockpit AGORA e gere a instrução para garantir o imposto de 6%!`;
                    }

                    if (msg !== '') {
                        const success = await sendWhatsAppMessage(u.whatsapp, msg);
                        if (success) {
                            await logNotification(u.id, type, currentMonthYearStr);
                            sentCount++;
                        }
                    }
                }
            }

            // Lógica: "Final do Mês" - Celebração e Indicação (Dia 30, ou últimos dias de Fev)
            const isEndOfMonth = dayOfMonth === 30 || (today.getMonth() === 1 && (dayOfMonth === 28 || dayOfMonth === 29));
            if (isEndOfMonth && instructionCopiedAt !== null && metrics) {
                const type = 'month_end_referral';
                const { count } = await supabase.from('notification_logs').select('*', { count: 'exact' }).eq('user_id', u.id).eq('notification_type', type).eq('month_year', currentMonthYearStr);

                if (count === 0) {
                    let msg = `O mês está fechando, *${u.full_name}*! 🎉 Parabéns, você engajou sua empresa nesse mês e calculamos uma economia de impostos na casa dos R$ ${metrics.valorEconomia} com a Fatorr!\n\n`;
                    msg += `Lembre-se dar uma última espiada no seu Histórico Fatorr pra garantir que o painel tá espelhando o que suas Notas Fiscais reais deram no final das contas.\n\n`;
                    msg += `Conhece outro PJ que tá perdendo dinheiro pagando imposto caro pro Governo? Faz a boa, manda o link pra ele economizar também: https://fatorr.app/ 🚀`;

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
    } catch (err: unknown) {
        console.error("Erro na Edge Function ZAPI:", err);
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
