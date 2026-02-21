'use client';

import { Input } from '@/components/input';
import { Button } from '@/components/primitives/button';
import Form from '@/components/primitives/form';
import { CadastrarUsuarioFormValue, cadastrarUsuarioSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, User2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

type CadastrarUsuarioFormProps = {}

export default function CadastrarUsuarioForm({ }: CadastrarUsuarioFormProps) {
  const form = useForm<CadastrarUsuarioFormValue>({
    resolver: zodResolver(cadastrarUsuarioSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: CadastrarUsuarioFormValue) => {
    console.log(data);
    // const response = await login(data.email, data.password);
    // if (!response.ok) {
    //   if (response.fields.length > 0) {
    //     response.fields.forEach((fieldError) => {
    //       if (fieldError.field === "email" || fieldError.field === "password") {
    //         form.setError(fieldError.field, {
    //           type: "server",
    //           message: fieldError.message,
    //         });
    //       }
    //     });
    //   }

    //   toast.error(response.message.descricao);
    //   return;
  }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        type="text"
        label="Nome"
        placeholder="Digite seu nome"
        icon={User2}
        error={form.formState.errors.nome}
        {...form.register("nome")}
      />

      <Input
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        icon={Mail}
        error={form.formState.errors.email}
        {...form.register("email")}
      />

      <Input
        type="password"
        label="Senha"
        icon={LockKeyhole}
        placeholder="Digite sua senha"
        error={form.formState.errors.password}
        {...form.register("password")}
      />

      <Input
        type="password"
        label="Confirme a senha"
        icon={LockKeyhole}
        placeholder="Digite novamente sua senha"
        error={form.formState.errors.passwordConfirmation}
        {...form.register("passwordConfirmation")}
      />

      <div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-8"
        >
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </Form>
  )
}