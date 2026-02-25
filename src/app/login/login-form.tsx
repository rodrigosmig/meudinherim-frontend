'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { getApiErrorMessage, isApiFormErrorResponse, isApiSuccessResponse } from "@/helpers/api-type-guards";
import { LoginFormValue, loginSchema } from "@/schemas/auth";
import { login } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValue) => {
    const response = await login(data);

    if (isApiFormErrorResponse(response)) {
      response.data.fields.forEach((fieldError) => {
        if (["email", "password"].includes(fieldError.field)) {
          form.setError(fieldError.field as keyof LoginFormValue, {
            type: "server",
            message: fieldError.message,
          });
        }
      });

      toast.error(response.message.descricao);
      return;
    }

    if (isApiSuccessResponse(response)) {
      router.push("/");
      router.refresh();
      return;
    }

    toast.error(getApiErrorMessage(response, "Erro ao fazer o login do usuário"));
    return;
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
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