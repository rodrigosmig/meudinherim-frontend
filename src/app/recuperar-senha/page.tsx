import { AuthLayout } from "@/components/auth-layout";
import { Metadata } from "next";
import RecaptchaProvider from "@/providers/recaptcha-provider";

import { RecuperarSenhaForm } from "./recuperar-senha-form";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
};

export default function RecuperarSenhaPage() {
  return (
    <AuthLayout
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail e enviaremos um código de verificação"
      backHref="/login"
    >
      <RecaptchaProvider>
        <RecuperarSenhaForm />
      </RecaptchaProvider>
    </AuthLayout>
  );
}
