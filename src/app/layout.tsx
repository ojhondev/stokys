import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Família única do site (pedido do usuário) — Regular pro corpo, Bold pros títulos.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Stokys — Sua loja de dropshipping, do jeito certo",
  description:
    "A Stokys monta sua loja de dropshipping do zero: escolha o plano, acompanhe a produção e receba pronta para vender.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
