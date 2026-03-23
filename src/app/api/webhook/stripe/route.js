import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Habilita a leitura em RAW text para a signature validation do Stripe no App Router (Next.js 14+)
export const dynamic = 'force-dynamic';

export async function POST(req) {
    // Inicializa clientes dentro do handler dinâmico para evitar crache no BUILD da Vercel
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
    });

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const bodyText = await req.text(); // Obrigatório ler como texto puro
    const signature = req.headers.get('stripe-signature');

    let event;

    try {
        // Validação estrita da Assinatura Criptográfica do Stripe
        event = await stripe.webhooks.constructEventAsync(
            bodyText,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`⚠️ Erro na Assinatura do Webhook: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Processamento Idempotente dos Eventos
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                
                // Puxamos o user_id que passaremos no client-reference-id ou via e-mail match
                // Para maior robustez, o Stripe retorna o campo customer (string id) e a subscription.
                const customerId = session.customer;
                const subscriptionId = session.subscription;
                const customerEmail = session.customer_details?.email;

                console.log(`✅ Nova Assinatura Concluída! Cliente: ${customerId} | Ref: ${session.client_reference_id}`);

                // Se passarmos o UID do Supabase pelo checkout, usamos ele, senão fazemos match por E-mail
                const targetUid = session.client_reference_id; 

                if (targetUid) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            stripe_subscription_status: 'active'
                        })
                        .eq('id', targetUid);
                } else if (customerEmail) {
                    // Fallback para e-mail
                    const { data: userProfile } = await supabaseAdmin
                        .from('profiles')
                        .select('id')
                        .eq('email', customerEmail)
                        .single();

                    if (userProfile) {
                        await supabaseAdmin
                            .from('profiles')
                            .update({
                                stripe_customer_id: customerId,
                                stripe_subscription_id: subscriptionId,
                                stripe_subscription_status: 'active'
                            })
                            .eq('id', userProfile.id);
                    }
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                // Ex: 'active', 'past_due', 'canceled', 'unpaid', 'trialing'
                const status = subscription.status; 
                
                console.log(`🔄 Assinatura Atualizada: ${subscription.id} -> Status: ${status}`);

                await supabaseAdmin
                    .from('profiles')
                    .update({ stripe_subscription_status: status })
                    .eq('stripe_customer_id', customerId);
                
                break;
            }

            case 'invoice.paid': {
                // Pode estender lógicas de envio de nota fiscal aqui depois
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                
                // Mudar para past_due irá bloquear momentaneamente o cockpit do usuário até ele resolver o cartão
                await supabaseAdmin
                    .from('profiles')
                    .update({ stripe_subscription_status: 'past_due' })
                    .eq('stripe_customer_id', customerId);

                break;
            }

            default:
                console.log(`Evento ignorado: ${event.type}`);
        }

        return new NextResponse(JSON.stringify({ received: true }), { status: 200 });

    } catch (error) {
        console.error('❌ Erro no Processamento do Banco de Dados do Webhook:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
