'use client';

import { Input } from "@/components/input/input";
import { Button } from "@/components/primitives/button";
import { login } from "@/lib/services/auth-service";
import { LoginFormValue } from "@/schemas/auth";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValue>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValue) => {
    const response = await login(data.email, data.password);
    if (!response.ok) {
      if (response.fields.length > 0) {
        response.fields.forEach((fieldError) => {
          if (fieldError.field === "email" || fieldError.field === "password") {
            form.setError(fieldError.field, {
              type: "server",
              message: fieldError.message,
            });
          }
        });
      }

      toast.error(response.message.descricao);
      return;
    }

    router.push("/");
    router.refresh();
  };
  return (
    <form className="space-y-4 p-8" onSubmit={form.handleSubmit(onSubmit)}>
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
    </form>
  )
}