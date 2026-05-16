import { AuthLayout } from "@/components/auth-layout";
import { Metadata } from "next";
import Link from "next/link";
import RecaptchaProvider from "@/providers/recaptcha-provider";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
      <RecaptchaProvider>
        <LoginForm />
      </RecaptchaProvider>
      <div className="mt-5 flex flex-col gap-2 border-t border-gray-700 pt-4">
        <Link href="/recuperar-senha" className="text-sm text-gray-400 hover:text-primary transition-colors">
          Esqueci minha senha
        </Link>
        <p className="text-sm text-gray-400">
          Não tem uma conta?{" "}
          <Link href="/cadastrar-usuario" className="text-primary hover:text-purple-400 transition-colors font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
