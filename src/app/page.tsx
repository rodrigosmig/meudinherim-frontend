'use client';

import { Card } from "@/components/card";
import { Input } from "@/components/input/input";
import { Button } from "@/components/primitives/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const loginSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type LoginFormValue = z.infer<typeof loginSchema>;

export default function Home() {
  const thData = ["Nome", "Tipo", "Exibir na Dashboard", "Ações"];

  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nome: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValue) => {
    console.log(data);
  }

  return (
    <Card.Root>
      <form className="space-y-2 p-12" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Nome"
          placeholder="Digite um nome..."
          icon={User2}
          error={form.formState.errors.nome}
          {...form.register('nome')}
        />

        <Input
          type="password"
          label="Senha"
          icon={LockKeyhole}
          placeholder="Digite uma senha..."
          error={form.formState.errors.password}
          {...form.register('password')}
        />

        <Button type="submit">Entrar</Button>
      </form>

    </Card.Root >
  );
}
