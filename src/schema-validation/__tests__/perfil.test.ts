import { perfilSchema, senhaSchema } from "../perfil";

describe("perfilSchema", () => {
  const valido = { nome: "João Silva", email: "joao@email.com", ativaNotificacao: true };

  it("aceita dados válidos", () => {
    expect(perfilSchema.safeParse(valido).success).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = perfilSchema.safeParse({ ...valido, nome: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita nome muito curto", () => {
    const result = perfilSchema.safeParse({ ...valido, nome: "A" });
    expect(result.success).toBe(false);
  });

  it("rejeita nome muito longo", () => {
    const result = perfilSchema.safeParse({ ...valido, nome: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejeita email inválido", () => {
    const result = perfilSchema.safeParse({ ...valido, email: "nao-e-email" });
    expect(result.success).toBe(false);
  });

  it("rejeita email vazio", () => {
    const result = perfilSchema.safeParse({ ...valido, email: "" });
    expect(result.success).toBe(false);
  });

  it("aceita ativaNotificacao false", () => {
    expect(perfilSchema.safeParse({ ...valido, ativaNotificacao: false }).success).toBe(true);
  });
});

describe("senhaSchema", () => {
  const valido = { senhaAtual: "senha123", novaSenha: "novaSenha1", novaSenhaConfirmacao: "novaSenha1" };

  it("aceita dados válidos", () => {
    expect(senhaSchema.safeParse(valido).success).toBe(true);
  });

  it("rejeita senhaAtual vazia", () => {
    const result = senhaSchema.safeParse({ ...valido, senhaAtual: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita novaSenha com menos de 8 caracteres", () => {
    const result = senhaSchema.safeParse({ ...valido, novaSenha: "curta", novaSenhaConfirmacao: "curta" });
    expect(result.success).toBe(false);
  });

  it("rejeita novaSenha vazia", () => {
    const result = senhaSchema.safeParse({ ...valido, novaSenha: "", novaSenhaConfirmacao: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita quando senhas não coincidem", () => {
    const result = senhaSchema.safeParse({ ...valido, novaSenhaConfirmacao: "outraSenha" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join("."));
      expect(paths).toContain("novaSenhaConfirmacao");
    }
  });

  it("rejeita confirmação vazia", () => {
    const result = senhaSchema.safeParse({ ...valido, novaSenhaConfirmacao: "" });
    expect(result.success).toBe(false);
  });
});
