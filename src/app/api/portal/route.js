import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// Força a leitura de cookies como rota dinâmica
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const cookieStore = cookies();
        const supabase = createServerComponentClient({ cookies: () => cookieStore });

        // Identifica o usuário logado de forma segura na API
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Não Autorizado', { status: 401 });
        }

        // Puxa o ID do Stripe via banco
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return new NextResponse('Cliente Stripe não encontrado. Acesse o suporte.', { status: 404 });
        }

        // Gera a sessão de gerenciamento no Stripe
        const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000';
        
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${origin}/cockpit`, // Volta tranquilamente pro dashboard amigável
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Erro ao acessar Portal do Cliente:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
