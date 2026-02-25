'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { getApiErrorMessage, isApiFormErrorResponse, isApiSuccessResponse } from "@/helpers/api-type-guards";
import { RecuperarSenhaFormValue, recuperarSenhaSchema } from "@/schemas/auth";
import { recuperarSenha } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function RecuperarSenhaForm() {
  const router = useRouter();

  const form = useForm<RecuperarSenhaFormValue>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecuperarSenhaFormValue) => {
    const response = await recuperarSenha(data);

    if (isApiFormErrorResponse(response)) {
      response.data.fields.forEach((fieldError) => {
        if (["email",].includes(fieldError.field)) {
          form.setError(fieldError.field as keyof RecuperarSenhaFormValue, {
            type: "server",
            message: fieldError.message,
          });
        }
      });
      toast.error(response.message.descricao);
      return;
    }

    if (isApiSuccessResponse(response)) {
      toast.success("Email de recuperação enviado com sucesso!");
      router.push("/login");
      return;
    }

    toast.error(getApiErrorMessage(response, "Erro ao recuperar senha do usuário"));
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
        disabled={form.formState.isSubmitting}
      >
        Enviar e-mail de recuperação
      </Button>
    </Form>
  )
}