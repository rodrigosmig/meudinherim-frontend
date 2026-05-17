import z from "zod";

export const pagamentoParcialFaturaSchema = z.object({
  idCategoriaEntrada: z.string().nonempty("O campo categoria de entrada é obrigatório"),
  idCategoriaSaida: z.string().nonempty("O campo categoria de saída é obrigatório"),
  idConta: z.string().nonempty("O campo conta é obrigatório"),
  dataPagamento: z.date(),
  descricao: z
    .string()
    .nonempty("O campo descrição é obrigatório")
    .min(2, "A descrição deve conter no mínimo 2 caracteres")
    .max(255, "A descrição deve conter no máximo 255 caracteres"),
  valor: z
    .number({ error: "O campo valor é obrigatório" })
    .gt(0, "O valor deve ser maior que zero"),
});

export type PagamentoParcialFaturaFormValue = z.infer<typeof pagamentoParcialFaturaSchema>;
