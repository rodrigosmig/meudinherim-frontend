import z from "zod";

export const fecharFaturaSchema = z.object({
  idCategoria: z.string().nonempty("O campo categoria é obrigatório"),
});

export type FecharFaturaFormValue = z.infer<typeof fecharFaturaSchema>;
