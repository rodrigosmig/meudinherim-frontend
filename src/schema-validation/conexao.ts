import z from "zod";

export const enviarSolicitacaoSchema = z.object({
  idDestinatario: z.string().uuid("UUID inválido"),
});

export type EnviarSolicitacaoFormValue = z.infer<typeof enviarSolicitacaoSchema>;
