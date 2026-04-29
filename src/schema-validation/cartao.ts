import z from "zod";

export const cartaoSchema = z.object({
  nome: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .min(2, "O nome deve conter no mínimo 2 caracteres")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
  diaVencimento: z
    .number({ error: "O campo dia de vencimento é obrigatório" })
    .int()
    .min(1, "O dia deve ser entre 1 e 31")
    .max(31, "O dia deve ser entre 1 e 31"),
  diaFechamento: z
    .number({ error: "O campo dia de fechamento é obrigatório" })
    .int()
    .min(1, "O dia deve ser entre 1 e 31")
    .max(31, "O dia deve ser entre 1 e 31"),
  limiteCredito: z
    .number({ error: "O campo limite de crédito é obrigatório" })
    .gt(0, "O limite deve ser maior que zero"),
});

export type CartaoFormValue = z.infer<typeof cartaoSchema>;
