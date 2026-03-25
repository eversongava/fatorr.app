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
      <head>
        {/* Google Ads Tag (Direto no Head para robôs do Google visualizarem fácil) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-980294217"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-980294217');
              ${process.env.NEXT_PUBLIC_GA_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');` : ''}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >        
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
