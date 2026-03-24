import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from 'sonner';

import Script from "next/script";

export const metadata: Metadata = {
  title: "Fatorr | Otimização Fiscal para Prestadores",
  description: "SaaS exclusivo de cálculo e manutenção do Fator R (Anexo III) para o Simples Nacional. Economize em impostos pagando apenas 6%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics Global Tag (Injeção via Env Var) */}
        {(process.env.NEXT_PUBLIC_GA_ID || true) && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'AW-980294217'}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  ${process.env.NEXT_PUBLIC_GA_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });` : ''}
                  gtag('config', 'AW-980294217');
                `,
              }}
            />
          </>
        )}
        
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
