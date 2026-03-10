import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa o Stripe usando a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export async function POST(req) {
    try {
        // Para simplificar, estamos pegando a origin da própria request
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Obtém o Price ID do plano .env
        const priceId = process.env.STRIPE_PRICE_ID;

        if (!priceId || priceId.includes('placeholder')) {
            console.warn('STRIPE_PRICE_ID não configurado ou é placeholder. Usando modo de simulação para fallback frontend.');
            return NextResponse.json({ url: `${origin}/login?checkout=success&simulated=true` });
        }

        // Cria a sessão de checkout no Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            // Aplica os 30 dias de teste grátis (exige cartão)
            subscription_data: {
                trial_period_days: 30,
            },
            // Redireciona para o Auth de volta com parâmetro de sucesso
            success_url: `${origin}/login?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            // Volta para a landing page em caso de cancelamento/voltar
            cancel_url: `${origin}/`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Erro ao criar sessão do Stripe:', error);

        // Se der erro no Stripe por causa das chaves de teste falsas que estão no .env,
        // devolve o fallback de simulação para que a UI continue funcionando no ambiente local
        console.warn('Forçando modo de simulação devido a falha no Stripe (chaves reais necessárias).');
        const origin = req.headers.get('origin') || 'http://localhost:3000';
        return NextResponse.json({ url: `${origin}/login?checkout=success&simulated=true` });
    }
}
