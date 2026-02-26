import { Suspense } from "react";

import { ResetarSenha } from "./resetar-senha";

export default function ResetarSenhaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetarSenha />
    </Suspense>
  );
}