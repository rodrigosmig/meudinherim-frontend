import "./globals.css";

import { AuthProvider } from "@/contexts/auth-context";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Metadata } from "next";

import BProgressProvider from "../providers/b-progress-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: {
    template: "%s | Meu Dinheirim",
    default: "Meu Dinheirim",
  },
  description: "Sistema de controle financeiro pessoal para ajudar você a organizar suas finanças, acompanhar seus gastos e alcançar seus objetivos financeiros.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased text-sm md:text-base text-white`}>
        <Toaster richColors closeButton position="top-right" />
        <BProgressProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BProgressProvider>
      </body>
    </html>
  );
}
