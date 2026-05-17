import { Suspense } from "react";
import { Metadata } from "next";

import { ResetarSenha } from "./resetar-senha";

export const metadata: Metadata = {
  title: "Resetar Senha",
}

export default function ResetarSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetarSenha />
    </Suspense>
  );
}