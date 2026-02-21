'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { capitalize } from "@/helpers/utils";
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
    const response = await recuperarSenha(data.email);
    if (!response.ok) {
      if (response.fields.length > 0) {
        response.fields.forEach((fieldError) => {
          if (fieldError.field === "email") {
            form.setError(fieldError.field, {
              type: "server",
              message: capitalize(fieldError.message),
            });
          }
        });
      }

      toast.error(response.message.descricao);
      return;
    }

    toast.success("Email de recuperação enviado com sucesso!");
    router.push("/login");
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