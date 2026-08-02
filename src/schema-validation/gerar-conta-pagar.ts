import z from "zod";

export const gerarContaAPagarSchema = z
  .object({
    idCategoria: z.string().nonempty("Categoria é obrigatória"),
    isParcelado: z.boolean(),
    quantidadeParcelas: z
      .number()
      .int("Deve ser um número inteiro")
      .min(2, "Mínimo 2 parcelas")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isParcelado && (data.quantidadeParcelas === undefined || data.quantidadeParcelas === null)) {
        return false;
      }
      return true;
    },
    {
      message: "Informe o número de parcelas",
      path: ["quantidadeParcelas"],
    },
  );

export type GerarContaAPagarFormValue = z.infer<typeof gerarContaAPagarSchema>;
