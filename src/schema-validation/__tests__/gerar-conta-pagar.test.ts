import { gerarContaAPagarSchema } from "../gerar-conta-pagar";

// ── gerarContaAPagarSchema ────────────────────────────────────────────────────

describe("gerarContaAPagarSchema", () => {
  describe("idCategoria", () => {
    it("valida dados corretos", () => {
      expect(
        gerarContaAPagarSchema.safeParse({ idCategoria: "cat-1", isParcelado: false }).success,
      ).toBe(true);
    });

    it("falha com string vazia", () => {
      expect(
        gerarContaAPagarSchema.safeParse({ idCategoria: "", isParcelado: false }).success,
      ).toBe(false);
    });

    it("valida com UUID", () => {
      expect(
        gerarContaAPagarSchema.safeParse({
          idCategoria: "550e8400-e29b-41d4-a716-446655440000",
          isParcelado: false,
        }).success,
      ).toBe(true);
    });

    it("falha com campo ausente", () => {
      expect(gerarContaAPagarSchema.safeParse({}).success).toBe(false);
    });

    it("falha com tipo inválido (número em vez de string)", () => {
      expect(
        gerarContaAPagarSchema.safeParse({ idCategoria: 123, isParcelado: false }).success,
      ).toBe(false);
    });
  });

  describe("isParcelado e quantidadeParcelas", () => {
    it("valida com isParcelado false e sem quantidadeParcelas", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
        isParcelado: false,
      });
      expect(result.success).toBe(true);
    });

    it("valida com isParcelado true e quantidadeParcelas válida", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
        isParcelado: true,
        quantidadeParcelas: 3,
      });
      expect(result.success).toBe(true);
    });

    it("falha com isParcelado true e sem quantidadeParcelas", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
        isParcelado: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("quantidadeParcelas");
      }
    });

    it("falha com quantidadeParcelas menor que 2", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
        isParcelado: true,
        quantidadeParcelas: 1,
      });
      expect(result.success).toBe(false);
    });

    it("falha com isParcelado ausente", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
      });
      expect(result.success).toBe(false);
    });

    it("falha com quantidadeParcelas não inteiro", () => {
      const result = gerarContaAPagarSchema.safeParse({
        idCategoria: "cat-1",
        isParcelado: true,
        quantidadeParcelas: 2.5,
      });
      expect(result.success).toBe(false);
    });
  });
});
