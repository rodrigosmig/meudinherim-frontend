import { Suspense } from "react";
import { Metadata } from "next";

import ConfirmarEmail from "./confirmar-email";

export const metadata: Metadata = {
  title: "Confirmar Email",
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmarEmail />
    </Suspense>
  );
}