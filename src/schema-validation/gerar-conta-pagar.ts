import z from "zod";

export const gerarContaAPagarSchema = z.object({
  idCategoria: z.string().nonempty("Categoria é obrigatória"),
});

export type GerarContaAPagarFormValue = z.infer<typeof gerarContaAPagarSchema>;
