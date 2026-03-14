import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import Text from "@/components/primitives/text";
import Icon from "@/components/primitives/icon";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { RecuperarSenhaForm } from "./recuperar-senha-form";

export const metadata: Metadata = {
  title: "Recuperar Senha",
}

export default function RecuperarSenha() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
        <Text variant="heading-large">MEU DINHEIRIM</Text>
        <Card.Root className="w-87.5 md:w-90">
          <Card.Header className="relative">
            <Link href="/login">
              <Button
                variant="back"
                tooltip="Voltar"
                aria-label="Voltar"
              >
                <Icon icon={ChevronLeft} />
              </Button>
            </Link>
            <Text className="text-center" variant="heading-medium">Recuperar senha</Text>
          </Card.Header>

          <RecuperarSenhaForm />
        </Card.Root>
      </div>
    </div>
  )
}