import { enviarSolicitacaoSchema } from "../conexao";

// ── enviarSolicitacaoSchema ──────────────────────────────────────────────────

describe("enviarSolicitacaoSchema", () => {
  it("valida dados corretos com UUID válido", () => {
    expect(
      enviarSolicitacaoSchema.safeParse({
        idDestinatario: "550e8400-e29b-41d4-a716-446655440000",
      }).success,
    ).toBe(true);
  });

  it("falha com UUID inválido", () => {
    expect(
      enviarSolicitacaoSchema.safeParse({ idDestinatario: "not-a-uuid" }).success,
    ).toBe(false);
  });

  it("falha com string vazia", () => {
    expect(
      enviarSolicitacaoSchema.safeParse({ idDestinatario: "" }).success,
    ).toBe(false);
  });

  it("falha com campo ausente", () => {
    expect(enviarSolicitacaoSchema.safeParse({}).success).toBe(false);
  });

  it("falha com tipo inválido (número em vez de string)", () => {
    expect(
      enviarSolicitacaoSchema.safeParse({ idDestinatario: 123 }).success,
    ).toBe(false);
  });
});
