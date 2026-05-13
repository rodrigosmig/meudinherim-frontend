'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { catalogoErros } from "@/helpers/erros-helper";
import { DEFAULT_ERROR_MESSAGE } from '@/helpers/route-helpers';
import { capitalize } from "@/helpers/string-helper";
import { ReenviarEmailConfirmacaoFormValue, reenviarEmailConfirmacaoSchema } from "@/schema-validation/auth";
import { authService } from "@/services/auth-service";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ReenviarEmailConfirmacaoForm() {
  const router = useRouter();

  const form = useForm<ReenviarEmailConfirmacaoFormValue>({
    resolver: zodResolver(reenviarEmailConfirmacaoSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ReenviarEmailConfirmacaoFormValue) => {

    try {
      await authService.reenviarEmailConfirmacao(data);

      form.reset()

      toast.success("Email de confirmação de conta enviado com sucesso!");

      router.push("/login");

      return;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;

          formError.fields.forEach((fieldError) => {
            if (["email"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof ReenviarEmailConfirmacaoFormValue, {
                type: "server",
                message: fieldError.message,
              });
            }
          });
        }

        if (error.apiMessage?.codigo === catalogoErros.USUARIO_NAO_ENCONTRADO) {
          form.setError("email", {
            type: "server",
            message: capitalize(error.apiMessage.descricao),
          });
          form.setFocus("email");
        }

        toast.error(capitalize(error.apiMessage.descricao));
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
      return;
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
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
        Reenviar e-mail
      </Button>
    </Form>
  )
}