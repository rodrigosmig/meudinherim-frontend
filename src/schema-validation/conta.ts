import { TipoConta } from "@/types/enum/tipo-conta";
import z from "zod";

export const contaSchema = z.object({
  nome: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .min(2, "O nome deve conter no mínimo 2 caracteres")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
  tipo: z.nativeEnum(TipoConta, {
    error: "O campo tipo é obrigatório",
  }),
  icon: z.string(),
});

export type ContaFormValue = z.infer<typeof contaSchema>;
