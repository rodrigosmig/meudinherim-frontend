import { ResetarSenhaFormValue, resetarSenhaSchema } from "@/schema-validation/auth";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { Button } from "@/components/primitives/button";
import { authService } from "@/services/auth-service";
import { catalogoErros } from "@/helpers/erros-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/primitives/input";
import ApiError from "@/types/application-error";
import Form from "@/components/primitives/form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import { LockKeyhole } from "lucide-react";
import { ApiFormError } from "@/types/api";
import { useForm } from "react-hook-form";

interface ResetarSenhaFormProps {
  token: string;
}

export function ResetarSenhaForm({ token }: ResetarSenhaFormProps) {
  const router = useRouter();

  const form = useForm<ResetarSenhaFormValue>({
    resolver: zodResolver(resetarSenhaSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: ResetarSenhaFormValue) => {
    const formData = {
      token,
      ...data,
    };

    try {
      await authService.resetarSenha(formData);

      toast.success("Senha resetada com sucesso!");

      form.reset();

      router.push("/login");

      return;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;

          formError.fields.forEach((fieldError) => {
            if (["password", "passwordConfirmation"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof ResetarSenhaFormValue, {
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

      <Button
        type="submit"
        className="w-full mt-8"
        isLoading={form.formState.isSubmitting}
        disabled={form.formState.isSubmitting}
      >
        Resetar Senha
      </Button>
    </Form>
  )
}