import z from "zod";

export const lancamentoContaSchema = z.object({
  idConta: z.uuid("Conta inválida").min(1, "O campo conta é obrigatório"),
  idCategoria: z
    .uuid("Categoria inválida")
    .min(1, "O campo categoria é obrigatório"),
  dataLancamento: z.date(),
  descricao: z
    .string()
    .min(2, "A descrição deve conter no mínimo 2 caracteres")
    .max(255, "A descrição deve conter no máximo 255 caracteres"),
  valor: z.number().positive("O valor deve ser maior que zero"),
});

export type LancamentoContaFormValue = z.infer<typeof lancamentoContaSchema>;
