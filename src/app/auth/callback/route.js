import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') ?? '/cockpit';

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
            // Ignore em Server Components
          }
        },
      },
    }
  );

  // FLUXO OTP / MAGIC LINK (Padrão mais novo do Supabase)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
    console.error("Erro no Auth Callback (verifyOtp):", error);
  }
  // FLUXO DE CÓDIGO (OAuth ou PKCE legado)
  else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
    console.error("Erro no Auth Callback (exchangeCode):", error);
  }

  // Se falhar ou não vier o código, chuta de volta pro login com aviso
  return NextResponse.redirect(`${requestUrl.origin}/login?error=magic_link_expired`);
}
