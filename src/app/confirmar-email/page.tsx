import { Suspense } from "react";

import ConfirmarEmail from "./confirmar-email";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmarEmail />
    </Suspense>
  );
}