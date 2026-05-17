import { transferenciaEntreContasSchema } from "../transferencia-entre-contas";

const valido = {
  idContaOrigem: "conta-1",
  idCategoriaOrigem: "cat-1",
  idContaDestino: "conta-2",
  idCategoriaDestino: "cat-2",
  data: new Date("2024-01-15"),
  descricao: "Transferência",
  valor: 100,
};

describe("transferenciaEntreContasSchema", () => {
  it("aceita dados válidos", () => {
    expect(transferenciaEntreContasSchema.safeParse(valido).success).toBe(true);
  });

  it("rejeita quando conta origem e destino são iguais", () => {
    const result = transferenciaEntreContasSchema.safeParse({
      ...valido,
      idContaDestino: "conta-1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join("."));
      expect(paths).toContain("idContaDestino");
    }
  });

  it("rejeita idContaOrigem vazio", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, idContaOrigem: "" }).success).toBe(false);
  });

  it("rejeita idContaDestino vazio", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, idContaDestino: "" }).success).toBe(false);
  });

  it("rejeita valor zero", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, valor: 0 }).success).toBe(false);
  });

  it("rejeita valor negativo", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, valor: -10 }).success).toBe(false);
  });

  it("rejeita descrição vazia", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, descricao: "" }).success).toBe(false);
  });

  it("rejeita descrição muito longa", () => {
    expect(transferenciaEntreContasSchema.safeParse({ ...valido, descricao: "a".repeat(256) }).success).toBe(false);
  });
});
