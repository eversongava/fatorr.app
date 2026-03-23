import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing user sessions.
                        }
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Não Autorizado', { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000';

        if (!profile?.stripe_customer_id) {
            // FALLBACK INTELIGENTE: Se o usuário logado ainda não possui ID no Stripe (ex: conta antiga ou teste),
            // enviamos ele direto para o Checkout para criar a assinatura agora mesmo!
            const priceId = process.env.STRIPE_PRICE_ID;
            
            if (!priceId || priceId.includes('placeholder')) {
                return NextResponse.json({ url: `${origin}/login?checkout=success&simulated=true` });
            }

            const checkoutSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                subscription_data: { trial_period_days: 30 },
                client_reference_id: user.id, // Amarração blindada pelo ID do Supabase
                success_url: `${origin}/login?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/cockpit`,
            });

            return NextResponse.json({ url: checkoutSession.url });
        }
        
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${origin}/cockpit`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Erro ao acessar Portal do Cliente:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
