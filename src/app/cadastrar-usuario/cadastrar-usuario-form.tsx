'use client';

import { Button } from '@/components/primitives/button';
import Form from '@/components/primitives/form';
import { Input } from '@/components/primitives/input';
import Text from '@/components/primitives/text';
import { getApiErrorCode, getApiErrorMessage, isApiFormErrorResponse, isApiSuccessResponse } from '@/helpers/api-type-guards';
import { catalogoErros } from '@/helpers/erros';
import { capitalize } from '@/helpers/utils';
import { CadastrarUsuarioFormValue, cadastrarUsuarioSchema } from '@/schemas/auth';
import { cadastrarUsuario } from '@/services/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail, User2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CadastrarUsuarioFormProps = {}

export default function CadastrarUsuarioForm({ }: CadastrarUsuarioFormProps) {
  const [isCadastrado, setIsCadastrado] = useState(false);

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
    const response = await cadastrarUsuario(data);

    if (isApiFormErrorResponse(response)) {
      response.data.fields.forEach((fieldError) => {
        if (["nome", "email", "password", "passwordConfirmation"].includes(fieldError.field)) {
          form.setError(fieldError.field as keyof CadastrarUsuarioFormValue, {
            type: "server",
            message: fieldError.message,
          });
        }
      });

      toast.error(response.message.descricao);
      return;
    }

    if (isApiSuccessResponse(response)) {
      toast.success("Usuário cadastrado com sucesso!");
      form.reset();
      setIsCadastrado(true);
      return;
    }

    const codigoErro = getApiErrorCode(response);

    if (codigoErro === catalogoErros.EMAIL_JA_CADASTRADO) {
      form.setError("email", {
        type: "server",
        message: capitalize(getApiErrorMessage(response, "Este e-mail já está em uso. Tente outro.")),
      });
    }

    toast.error(getApiErrorMessage(response, "Erro ao cadastrar usuário"));
    return;
  }

  return (
    <>
      {!isCadastrado
        ? (
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
                {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </Form>
        )
        : (
          <div className='flex flex-col gap-3 p-4'>
            <Text
              className='text-center'
              variant='paragraph-large'
            >
              Uma mensagem com um link de confirmação foi enviada para seu e-mail.
            </Text>
            <Text
              className='text-center'
              variant='paragraph-medium'
            >
              Caso já tenha ativado a conta, faça o <Link className='hover:text-violet-500' href="/login">login</Link>!
            </Text>
          </div>
        )

      }
    </>

  )
}