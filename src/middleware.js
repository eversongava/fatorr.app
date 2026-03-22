import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  // Inicialização extremamente rápida sem onerar leitura de DB pesado
  const supabase = createMiddlewareClient({ req, res });

  // Puxa a sessão do cookie
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isPrivateRoute = req.nextUrl.pathname.startsWith('/cockpit') || req.nextUrl.pathname.startsWith('/onboarding');

  // Se o usuário não tem sessão e tentou acessar rota privada
  if (!session && isPrivateRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Se o usuário já está logado e tentou acessar /login, manda pro cockpit
  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/cockpit';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Rodar o escudo em matchers específicos
export const config = {
  matcher: ['/cockpit/:path*', '/onboarding/:path*', '/login'],
};
