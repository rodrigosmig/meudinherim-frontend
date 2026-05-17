import z from "zod";

export const perfilSchema = z.object({
  nome: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .min(2, "O nome deve conter no mínimo 2 caracteres")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
  email: z.string().email("E-mail inválido").nonempty("O campo e-mail é obrigatório"),
  ativaNotificacao: z.boolean(),
});

export const senhaSchema = z
  .object({
    senhaAtual: z.string().nonempty("A senha atual é obrigatória"),
    novaSenha: z
      .string()
      .nonempty("A nova senha é obrigatória")
      .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
    novaSenhaConfirmacao: z.string().nonempty("A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.novaSenha === data.novaSenhaConfirmacao, {
    message: "As senhas não coincidem",
    path: ["novaSenhaConfirmacao"],
  });

export type PerfilFormValue = z.infer<typeof perfilSchema>;
export type SenhaFormValue = z.infer<typeof senhaSchema>;
