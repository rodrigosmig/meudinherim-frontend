import { AuthLayout } from "@/components/auth-layout";
import { Metadata } from "next";

import CadastrarUsuarioForm from "./cadastrar-usuario-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function CadastrarUsuarioPage() {
  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Preencha seus dados para começar"
      backHref="/login"
    >
      <CadastrarUsuarioForm />
    </AuthLayout>
  );
}
