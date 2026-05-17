import { AuthLayout } from "@/components/auth-layout";
import { Metadata } from "next";
import { Suspense } from "react";

import { ValidarCodigoForm } from "./validar-codigo-form";

export const metadata: Metadata = {
  title: "Verificar código",
};

export default function ValidarCodigoPage() {
  return (
    <AuthLayout
      title="Verifique seu e-mail"
      subtitle="Digite o código de 6 dígitos enviado para seu e-mail"
      backHref="/recuperar-senha"
    >
      <Suspense>
        <ValidarCodigoForm />
      </Suspense>
    </AuthLayout>
  );
}
