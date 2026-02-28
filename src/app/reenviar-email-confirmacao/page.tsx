import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import Text from "@/components/primitives/text";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import ReenviarEmailConfirmacaoForm from "./reenviar-email-confirmacao-form";

export const metadata: Metadata = {
  title: "Reenviar E-mail de Confirmação",
}

export default function ReenviarEmailConfirmacao() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
        <Text variant="heading-large">MEU DINHEIRIM</Text>
        <Card.Root className="w-96 max-w-md">
          <Card.Header className="relative">
            <Link href="/login">
              <Button
                className="bg-gray-900 border-0 w-6 h-6 text-gray-400 hidden md:flex absolute z-50 hover:text-white hover:bg-transparent rounded-md transition-all"
                tooltip="Voltar"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Text className="text-center" variant="heading-medium">Reenviar e-mail</Text>
          </Card.Header>

          <ReenviarEmailConfirmacaoForm />
        </Card.Root>
      </div>
    </div>
  )
}