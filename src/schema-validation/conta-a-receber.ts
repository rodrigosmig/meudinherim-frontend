import { Periodicidade } from "@/types/enum/periodicidade";
import z from "zod";

export const contaAReceberSchema = z.object({
  descricao: z
    .string()
    .nonempty("O campo descrição é obrigatório")
    .min(2, "A descrição deve conter no mínimo 2 caracteres")
    .max(255, "A descrição deve conter no máximo 255 caracteres"),
  valor: z
    .number({ error: "O campo valor é obrigatório" })
    .gt(0, "O valor deve ser maior que zero"),
  idCategoria: z.string().nonempty("O campo categoria é obrigatório"),
  dataVencimento: z.date(),
  periodicidade: z.nativeEnum(Periodicidade, {
    error: "O campo periodicidade é obrigatório",
  }),
  parcelado: z.boolean(),
  quantidadeParcelas: z.number().int().min(2, "Mínimo 2 parcelas").optional(),
  tags: z.array(z.string()).optional(),
});

export type ContaAReceberFormValue = z.infer<typeof contaAReceberSchema>;

export const receberContaSchema = z.object({
  dataPagamento: z.date(),
  valor: z
    .number({ error: "O campo valor é obrigatório" })
    .gt(0, "O valor deve ser maior que zero"),
  idConta: z.string().nonempty("O campo conta é obrigatório"),
});

export type ReceberContaFormValue = z.infer<typeof receberContaSchema>;
