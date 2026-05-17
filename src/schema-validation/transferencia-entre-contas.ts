import z from "zod";

export const transferenciaEntreContasSchema = z
  .object({
    idContaOrigem: z.string().nonempty("A conta de origem é obrigatória"),
    idCategoriaOrigem: z.string().nonempty("A categoria de origem é obrigatória"),
    idContaDestino: z.string().nonempty("A conta de destino é obrigatória"),
    idCategoriaDestino: z.string().nonempty("A categoria de destino é obrigatória"),
    data: z.date(),
    descricao: z
      .string()
      .nonempty("O campo descrição é obrigatório")
      .min(2, "A descrição deve conter no mínimo 2 caracteres")
      .max(255, "A descrição deve conter no máximo 255 caracteres"),
    valor: z
      .number({ error: "O campo valor é obrigatório" })
      .gt(0, "O valor deve ser maior que zero"),
  })
  .refine((data) => data.idContaOrigem !== data.idContaDestino, {
    message: "A conta de destino deve ser diferente da conta de origem",
    path: ["idContaDestino"],
  });

export type TransferenciaEntreContasFormValue = z.infer<typeof transferenciaEntreContasSchema>;
