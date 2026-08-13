import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const otsonoSubstitute = Inter({
  variable: "--font-otsono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Stokys — Sua loja de dropshipping, do jeito certo",
  description:
    "A Stokys monta sua loja de dropshipping do zero: escolha o plano, acompanhe a produção e receba pronta para vender.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${otsonoSubstitute.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
