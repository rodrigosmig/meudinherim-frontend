'use client';

import { Button } from "@/components/primitives/button";
import Form from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { useAuth } from "@/contexts/auth-context";
import { catalogoErros } from "@/helpers/erros-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { LoginFormValue, loginSchema } from "@/schema-validation/auth";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValue) => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA não está disponível. Recarregue a página e tente novamente.");
      return;
    }
    try {
      const recaptchaToken = await executeRecaptcha("login");
      await login({ ...data, recaptchaToken });
      setIsRedirecting(true);
      router.push('/');

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
          isLoading={form.formState.isSubmitting || isRedirecting}
          disabled={form.formState.isSubmitting || isRedirecting}
          className="w-full mt-8"
        >
          Entrar
        </Button>
      </div>
    </Form>
  )
}