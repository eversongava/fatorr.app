# 📘 Fatorr.app - Código de Conduta da Inteligência Artificial (AI_RULES)

Este documento dita as diretrizes absolutas de arquitetura, segurança e convenções da base de código do Fatorr.app. Qualquer Desenvolvedor ou IA atuando neste repósitorio deve seguir estritamente estas regras.

## 1. Stack Tecnológica Base
- **Frontend / Fullstack:** Next.js 15+ (App Router, Turbopack)
- **Banco de Dados & Backend:** Supabase (PostgreSQL, Auth, Edge Functions Deno)
- **Gateway de Pagamentos:** Stripe (Checkout Sessions & Customer Portal)
- **Notificações Visuais (UX):** Sonner (Toasts assíncronos)
- **Notificações WhatsApp (Eventos):** Z-API

## 2. Padrões Invioláveis de Autenticação (Next.js SSR + PKCE Flow)
O motor de renderização da Vercel age ativamente na camada de segurança. Sendo assim:
1. **NUNCA** utilize o `@supabase/supabase-js` com tokens implicitos (modo Hash na URL) no Frontend.
2. Todo o Fatorr.app opera sobre o padrão `@supabase/ssr`. As chamadas do Front-end devem empregar obrigatoriamente `createBrowserClient()`.
3. Os logins sem senha (OTP / Magic Links) disparam e-mails que obrigatoriamente levam o usuário à Rota de Callback Segura: `/auth/callback?next=/cockpit`.
4. Essa rota absorve o `?code` do PKCE ou `?token_hash`, chamando `exchangeCodeForSession` para plantar os Cookies protegidos do servidor.
5. Em **Next.js 15**, a função `cookies()` nativa é **Assíncrona**. Qualquer leitura de sessão nos componentes e rotas deve rodar `await cookies()`, sob pena de `Erro 500 - Internal Server Error` na subida de produção.

## 3. Segurança Banco de Dados e RLS (Row Level Security)
1. **Cockpit Trancado:** O acesso à aplicação (`/cockpit`, `/onboarding`) é garantido pelo `middleware.js` no momento da requisição HTTP (Edge Router).
2. O aplicativo opera num regime rigoroso de Multi-Tenant:
    - O banco de dados exige `RLS Policies` restritivas do tipo `CHECK (auth.uid() = id)` ou `user_id = auth.uid()`.
3. **Escalada de Privilégios no Back-end:** Rotas de Webhook (como `/api/webhook/stripe`) exigem manipulação cega do banco sem logar como usuário local. Utilize estritamente a **Service Role Key** da nuvem sem JAMAIS entregar seus direitos para componentes Clients (`"use client"`).

## 4. Arquitetura de Pagamentos (Stripe & Falhas Inteligentes)
- O Fatorr aplica o Trial Automático de 30 dias diretamente via `session.create` no Stripe.
- **Fail-Safe / Fallback:** Caso um usuário nativo solicite estorno ou clique para ver o portal usando a Rota `/api/portal`, e o Supabase acuse ausência da coluna `stripe_customer_id`, a rota deve gerar instantaneamente uma janela de Checkout ao invés de colapsar com página Error 404.
- Para rastreabilidade no Webhook, injete `client_reference_id = user.id` no payload da API de checkout.

## 5. Convenções de UI e UX (Aparência e Navegação Premium)
- **Proibido o uso arcaico de `window.alert()`, `confirm()` ou `console.error()` aparentes.** 
- Todo o ciclo de requisição aguardando API, mensagens de conclusão da cópia das regras fiscais e bloqueios financeiros no painel usam animações visuais em fila importando os utilitários da biblioteca **Sonner** (`toast.promise()`, `toast.success()`, e `toast.error()`).

## 6. Microserviços Cloud e CRONs (Edge Functions - Deno)
- Todas as funções Serverless autônomas do Supabase (A pasta `supabase/functions/`) rodam no ecossistema Runtime do **Deno**.
- Não declare Node.js sintaxes cruas ou pacotes legados NPM lá dentro.
- O código do Deno obriga a captura de chaves sensíveis vindas do *Secret Manager* Global usando `Deno.env.get()`.
- O TypeScript reportará um falso-positivo em Imports baseados em URL HTTPS do Deno Land na IDE do desenvolvedor. A IA atuante deve injetar silenciosamente o metadado `// @ts-ignore: Deno URL Import` para limpar a poluição do editor sem estragar o compilar das Edge Functions.
