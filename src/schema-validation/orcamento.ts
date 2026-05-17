import z from "zod";

export const orcamentoSchema = z.object({
  idCategoria: z.string().nonempty("O campo categoria é obrigatório"),
  valor: z
    .number({ error: "O campo valor é obrigatório" })
    .gt(0, "O valor deve ser maior que zero"),
});

export type OrcamentoFormValue = z.infer<typeof orcamentoSchema>;
