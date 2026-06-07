import { gerarContaAPagarSchema } from "../gerar-conta-pagar";

// ── gerarContaAPagarSchema ────────────────────────────────────────────────────

describe("gerarContaAPagarSchema", () => {
  it("valida dados corretos", () => {
    expect(
      gerarContaAPagarSchema.safeParse({ idCategoria: "cat-1" }).success,
    ).toBe(true);
  });

  it("falha com string vazia", () => {
    expect(
      gerarContaAPagarSchema.safeParse({ idCategoria: "" }).success,
    ).toBe(false);
  });

  it("valida com UUID", () => {
    expect(
      gerarContaAPagarSchema.safeParse({
        idCategoria: "550e8400-e29b-41d4-a716-446655440000",
      }).success,
    ).toBe(true);
  });

  it("falha com campo ausente", () => {
    expect(gerarContaAPagarSchema.safeParse({}).success).toBe(false);
  });

  it("falha com tipo inválido (número em vez de string)", () => {
    expect(
      gerarContaAPagarSchema.safeParse({ idCategoria: 123 }).success,
    ).toBe(false);
  });
});
