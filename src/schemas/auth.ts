import z from "zod";

export const loginSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginFormValue = z.infer<typeof loginSchema>;

export const cadastrarUsuarioSchema = z
  .object({
    nome: z.string().min(3, "O campo nome deve ter no mínimo 3 caracteres"),
    email: z.email("E-mail inválido"),
    password: z
      .string()
      .min(8, "O campo senha deve ter no mínimo 8 caracteres"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "A confirmação de senha não corresponde à senha",
    path: ["passwordConfirmation"],
  });

export type CadastrarUsuarioFormValue = z.infer<typeof cadastrarUsuarioSchema>;

export const recuperarSenhaSchema = z.object({
  email: z.email("E-mail inválido"),
});

export type RecuperarSenhaFormValue = z.infer<typeof recuperarSenhaSchema>;

export const reenviarEmailConfirmacaoSchema = z.object({
  email: z.email("E-mail inválido"),
});

export type ReenviarEmailConfirmacaoFormValue = z.infer<
  typeof reenviarEmailConfirmacaoSchema
>;

export const resetarSenhaSchema = z
  .object({
    password: z
      .string()
      .min(8, "O campo senha deve ter no mínimo 8 caracteres"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "A confirmação de senha não corresponde à senha",
    path: ["passwordConfirmation"],
  });

export type ResetarSenhaFormValue = z.infer<typeof resetarSenhaSchema>;
