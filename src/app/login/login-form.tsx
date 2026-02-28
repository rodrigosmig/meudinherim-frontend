'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/constants";
import { catalogoErros } from "@/helpers/erros";
import { LoginFormValue, loginSchema } from "@/schema-validation/auth";
import { login } from "@/services/auth-service";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
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
    try {
      await login(data);

      router.push("/");

      return;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;

          formError.fields.forEach((fieldError) => {
            if (["email", "password"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof LoginFormValue, {
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
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
          className="w-full mt-8"
        >
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </Form>
  )
}