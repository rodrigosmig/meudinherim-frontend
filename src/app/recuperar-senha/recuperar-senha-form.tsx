'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { catalogoErros } from "@/helpers/erros-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { RecuperarSenhaFormValue, recuperarSenhaSchema } from "@/schema-validation/auth";
import { recuperarSenha } from "@/services/auth-service";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function RecuperarSenhaForm() {
  const router = useRouter();

  const form = useForm<RecuperarSenhaFormValue>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecuperarSenhaFormValue) => {
    try {
      await recuperarSenha(data);

      toast.success("Email de recuperação enviado com sucesso!");

      router.push("/login");

      return;

    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;

          formError.fields.forEach((fieldError) => {
            if (["email"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof RecuperarSenhaFormValue, {
                type: "server",
                message: fieldError.message,
              });
            }
          });
        }

        toast.error(error.apiMessage.descricao);
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
      return;
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        icon={Mail}
        label="E-mail"
        placeholder="Digite seu e-mail"
        error={form.formState.errors.email}
        {...form.register("email")}
      />

      <Button
        type="submit"
        className="w-full mt-8"
        isLoading={form.formState.isSubmitting}
        disabled={form.formState.isSubmitting}
      >
        Enviar e-mail de recuperação
      </Button>
    </Form>
  )
}