import { getApiErrorCode, getApiErrorMessage, isApiFormErrorResponse, isApiSuccessResponse } from "@/helpers/api-type-guards";
import { ResetarSenhaFormValue, resetarSenhaSchema } from "@/schemas/auth";
import { Button } from "@/components/primitives/button";
import { resetarSenha } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/primitives/input";
import Form from "@/components/primitives/form";
import { catalogoErros } from "@/helpers/erros";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import { LockKeyhole } from "lucide-react";
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
    }
    const response = await resetarSenha(formData);

    if (isApiFormErrorResponse(response)) {
      response.data.fields.forEach((fieldError) => {
        if (["password", "passwordConfirmation"].includes(fieldError.field)) {
          form.setError(fieldError.field as keyof ResetarSenhaFormValue, {
            type: "server",
            message: fieldError.message,
          });
        }
      });
      toast.error(response.message.descricao);
      return;
    }

    if (isApiSuccessResponse(response)) {
      toast.success("Senha resetada com sucesso!");
      router.push("/login");
      return;
    }

    const errorCode = getApiErrorCode(response);
    if (errorCode === catalogoErros.TOKEN_NAO_ENCONTRADO) {
      toast.error("Não foi possível validar o token informado");
      return;
    }

    toast.error(getApiErrorMessage(response, "Erro ao resetar senha do usuário"));
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