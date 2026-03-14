import { Card } from "@/components/primitives/card";
import Text from "@/components/primitives/text";
import { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
        <Text variant="heading-large">MEU DINHEIRIM</Text>
        <Card.Root className="w-87.5 md:w-90">
          <LoginForm />

          <Card.Footer>
            <div className="flex flex-col gap-1">
              <Link href="/recuperar-senha">
                <Text className="hover:text-primary">Esqueci minha senha</Text>
              </Link>

              <Text>
                Não tem uma conta? <Link href="/cadastrar-usuario" className="hover:text-primary">Cadastre-se</Link>
              </Text>
            </div>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  );
}
