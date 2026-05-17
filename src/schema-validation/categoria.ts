import { TipoCategoria } from "@/types/enum/tipo-categoria";
import z from "zod";

export const categoriaSchema = z.object({
  nome: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .min(2, "O nome deve conter no mínimo 2 caracteres")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
  tipo: z.nativeEnum(TipoCategoria, {
    error: "O campo tipo é obrigatório",
  }),
  exibirNaDashboard: z.boolean(),
});

export type CategoriaFormValue = z.infer<typeof categoriaSchema>;
