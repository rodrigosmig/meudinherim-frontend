import { Periodicidade } from "@/types/enum/periodicidade";
import { contaAPagarSchema, pagarContaSchema } from "../conta-a-pagar";
import { contaAReceberSchema, receberContaSchema } from "../conta-a-receber";
import { fecharFaturaSchema } from "../fechar-fatura";
import { lancamentoCartaoSchema } from "../lancamento-cartao";
import { orcamentoSchema } from "../orcamento";
import { pagamentoParcialFaturaSchema } from "../pagamento-parcial-fatura";

// ── contaAPagarSchema ────────────────────────────────────────────────────────

describe("contaAPagarSchema", () => {
  const valid = {
    descricao: "Aluguel mensal",
    valor: 1500,
    idCategoria: "cat-1",
    dataVencimento: new Date(),
    periodicidade: Periodicidade.NENHUMA,
    parcelado: false,
    tags: [],
  };

  it("valida dados corretos", () => {
    expect(contaAPagarSchema.safeParse(valid).success).toBe(true);
  });

  it("falha com descrição curta (< 2 chars)", () => {
    expect(contaAPagarSchema.safeParse({ ...valid, descricao: "A" }).success).toBe(false);
  });

  it("falha com valor zero", () => {
    expect(contaAPagarSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });

  it("falha com valor negativo", () => {
    expect(contaAPagarSchema.safeParse({ ...valid, valor: -10 }).success).toBe(false);
  });

  it("falha sem idCategoria", () => {
    expect(contaAPagarSchema.safeParse({ ...valid, idCategoria: "" }).success).toBe(false);
  });

  it("valida com parcelado e quantidadeParcelas", () => {
    expect(
      contaAPagarSchema.safeParse({ ...valid, parcelado: true, quantidadeParcelas: 3 }).success,
    ).toBe(true);
  });

  it("valida tags opcionais omitidas", () => {
    const { tags: _, ...withoutTags } = valid;
    expect(contaAPagarSchema.safeParse(withoutTags).success).toBe(true);
  });
});

// ── pagarContaSchema ─────────────────────────────────────────────────────────

describe("pagarContaSchema", () => {
  const valid = { dataPagamento: new Date(), valor: 200, idConta: "conta-1" };

  it("valida dados corretos", () => {
    expect(pagarContaSchema.safeParse(valid).success).toBe(true);
  });

  it("falha com valor zero", () => {
    expect(pagarContaSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });

  it("falha sem idConta", () => {
    expect(pagarContaSchema.safeParse({ ...valid, idConta: "" }).success).toBe(false);
  });
});

// ── contaAReceberSchema ──────────────────────────────────────────────────────

describe("contaAReceberSchema", () => {
  const valid = {
    descricao: "Freelance projeto",
    valor: 3000,
    idCategoria: "cat-2",
    dataVencimento: new Date(),
    periodicidade: Periodicidade.MENSAL,
    parcelado: false,
    tags: [],
  };

  it("valida dados corretos", () => {
    expect(contaAReceberSchema.safeParse(valid).success).toBe(true);
  });

  it("falha com descrição curta", () => {
    expect(contaAReceberSchema.safeParse({ ...valid, descricao: "X" }).success).toBe(false);
  });

  it("falha com valor zero", () => {
    expect(contaAReceberSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });

  it("valida periodicidade trimestral", () => {
    expect(
      contaAReceberSchema.safeParse({ ...valid, periodicidade: Periodicidade.TRIMESTRAL }).success,
    ).toBe(true);
  });
});

// ── receberContaSchema ───────────────────────────────────────────────────────

describe("receberContaSchema", () => {
  const valid = { dataPagamento: new Date(), valor: 500, idConta: "conta-2" };

  it("valida dados corretos", () => {
    expect(receberContaSchema.safeParse(valid).success).toBe(true);
  });

  it("falha com valor zero", () => {
    expect(receberContaSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });
});

// ── fecharFaturaSchema ───────────────────────────────────────────────────────

describe("fecharFaturaSchema", () => {
  it("valida com idCategoria preenchido", () => {
    expect(fecharFaturaSchema.safeParse({ idCategoria: "cat-3" }).success).toBe(true);
  });

  it("falha com idCategoria vazio", () => {
    expect(fecharFaturaSchema.safeParse({ idCategoria: "" }).success).toBe(false);
  });
});

// ── lancamentoCartaoSchema ───────────────────────────────────────────────────

describe("lancamentoCartaoSchema", () => {
  const valid = {
    idCartao: "cartao-1",
    idCategoria: "cat-1",
    dataLancamento: new Date(),
    descricao: "Supermercado",
    valor: 250,
    tags: [],
  };

  it("valida dados corretos", () => {
    expect(lancamentoCartaoSchema.safeParse(valid).success).toBe(true);
  });

  it("falha sem idCartao", () => {
    expect(lancamentoCartaoSchema.safeParse({ ...valid, idCartao: "" }).success).toBe(false);
  });

  it("falha com descrição curta", () => {
    expect(lancamentoCartaoSchema.safeParse({ ...valid, descricao: "A" }).success).toBe(false);
  });

  it("falha com valor zero", () => {
    expect(lancamentoCartaoSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });

  it("valida sem tags", () => {
    const { tags: _, ...withoutTags } = valid;
    expect(lancamentoCartaoSchema.safeParse(withoutTags).success).toBe(true);
  });
});

// ── orcamentoSchema ──────────────────────────────────────────────────────────

describe("orcamentoSchema", () => {
  it("valida dados corretos", () => {
    expect(orcamentoSchema.safeParse({ idCategoria: "cat-1", valor: 500 }).success).toBe(true);
  });

  it("falha sem idCategoria", () => {
    expect(orcamentoSchema.safeParse({ idCategoria: "", valor: 500 }).success).toBe(false);
  });

  it("falha com valor zero", () => {
    expect(orcamentoSchema.safeParse({ idCategoria: "cat-1", valor: 0 }).success).toBe(false);
  });
});

// ── pagamentoParcialFaturaSchema ─────────────────────────────────────────────

describe("pagamentoParcialFaturaSchema", () => {
  const valid = {
    idCategoriaEntrada: "cat-entrada",
    idCategoriaSaida: "cat-saida",
    idConta: "conta-1",
    dataPagamento: new Date(),
    descricao: "Pagamento fatura",
    valor: 1200,
  };

  it("valida dados corretos", () => {
    expect(pagamentoParcialFaturaSchema.safeParse(valid).success).toBe(true);
  });

  it("falha com valor zero", () => {
    expect(pagamentoParcialFaturaSchema.safeParse({ ...valid, valor: 0 }).success).toBe(false);
  });

  it("falha sem idConta", () => {
    expect(pagamentoParcialFaturaSchema.safeParse({ ...valid, idConta: "" }).success).toBe(false);
  });

  it("falha com descrição curta", () => {
    expect(
      pagamentoParcialFaturaSchema.safeParse({ ...valid, descricao: "X" }).success,
    ).toBe(false);
  });
});
