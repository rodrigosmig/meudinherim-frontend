import z from "zod";

export const lancamentoCartaoSchema = z.object({
  idCartao: z.string().nonempty("O campo cartão é obrigatório"),
  idCategoria: z.string().nonempty("O campo categoria é obrigatório"),
  dataLancamento: z.date(),
  descricao: z
    .string()
    .nonempty("O campo descrição é obrigatório")
    .min(2, "A descrição deve conter no mínimo 2 caracteres")
    .max(255, "A descrição deve conter no máximo 255 caracteres"),
  valor: z
    .number({ error: "O campo valor é obrigatório" })
    .gt(0, "O valor deve ser maior que zero"),
  tags: z.array(z.string()).optional(),
});

export type LancamentoCartaoFormValue = z.infer<typeof lancamentoCartaoSchema>;
