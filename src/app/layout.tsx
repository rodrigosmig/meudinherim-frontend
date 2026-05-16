import "./globals.css";

import { AuthProvider } from "@/contexts/auth-context";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

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
    <html lang="pt-BR" className={pretendard.variable}>
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
