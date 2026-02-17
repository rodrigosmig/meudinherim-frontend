import z from "zod";

export const loginSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginFormValue = z.infer<typeof loginSchema>;
