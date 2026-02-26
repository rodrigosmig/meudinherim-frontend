'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { getApiErrorMessage, isApiFormErrorResponse, isApiSuccessResponse } from "@/helpers/api-type-guards";
import { ReenviarEmailConfirmacaoFormValue, reenviarEmailConfirmacaoSchema } from "@/schemas/auth";
import { reenviarEmailConfirmacao } from "@/services/auth-service";
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
    const response = await reenviarEmailConfirmacao(data);

    if (isApiFormErrorResponse(response)) {
      response.data.fields.forEach((fieldError) => {
        if (["email",].includes(fieldError.field)) {
          form.setError(fieldError.field as keyof ReenviarEmailConfirmacaoFormValue, {
            type: "server",
            message: fieldError.message,
          });
        }
      });
      toast.error(response.message.descricao);
      return;
    }

    if (isApiSuccessResponse(response)) {
      toast.success("Email de confirmação de conta enviado com sucesso!");
      router.push("/login");
      return;
    }

    toast.error(getApiErrorMessage(response, "Erro ao reenviar email de confirmação"));
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
        Reenviar e-mail de confirmação
      </Button>
    </Form>
  )
}