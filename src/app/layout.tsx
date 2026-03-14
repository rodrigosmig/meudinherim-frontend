import "./globals.css";

import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import { Metadata } from "next";

import BProgressProvider from "../providers/b-progress-provider";

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
    <html lang="pt-BR">
      <body className={`antialiased text-default-text`}>
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
