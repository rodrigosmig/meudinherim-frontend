import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import Text from "@/components/primitives/text";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import CadastrarUsuarioForm from "./cadastrar-usuario-form";

export default function Cadastro() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
        <Card.Root className="w-96 max-w-md">
          <Card.Header className="relative">
            <Link href="/login">
              <Button
                className="absolute top-2 left-2 bg-gray-900 border-0"
                tooltip="Voltar"
                variant="collapse"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Text className="text-center" variant="heading-medium">Cadastrar Usuário</Text>
          </Card.Header>

          <CadastrarUsuarioForm />
        </Card.Root>
      </div>
    </div>
  )
}