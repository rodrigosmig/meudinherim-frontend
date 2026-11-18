import { readFileSync } from "node:fs";
import path from "node:path";

const globalsCss = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
);
const layout = readFileSync(
  path.join(process.cwd(), "src/app/layout.tsx"),
  "utf8",
);

const mediaMobile = /@media\s*\(max-width:\s*767px\)\s*\{([\s\S]*?)\n\}/;

type RegraCss = {
  seletores: string[];
  declaracoes: string;
};

function extrairRegras(bloco: string): RegraCss[] {
  return [...bloco.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, seletores, declaracoes]) => ({
      seletores: seletores
        .split(",")
        .map((seletor) => seletor.trim())
        .filter(Boolean),
      declaracoes,
    }),
  );
}

describe("fonte dos campos de formulário no mobile", () => {
  it("aplica font-size de 16px em input, select e textarea abaixo de 768px", () => {
    const media = globalsCss.match(mediaMobile);

    expect(media).not.toBeNull();

    const regraDosCampos = extrairRegras(media![1]).find((regra) =>
      ["input", "select", "textarea"].every((campo) =>
        regra.seletores.includes(campo),
      ),
    );

    expect(regraDosCampos).toBeDefined();
    expect(regraDosCampos!.declaracoes).toMatch(/font-size:\s*16px/);
  });

  it("mantém a regra de 16px restrita a viewports abaixo de 768px", () => {
    const semMediaMobile = globalsCss.replace(
      /@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*?\n\}/g,
      "",
    );

    expect(semMediaMobile).not.toMatch(/font-size:\s*16px/);
  });

  it("não desativa o zoom do viewport no layout", () => {
    expect(layout).not.toMatch(/maximum-scale|user-scalable\s*[:=]\s*["']?no/i);
    expect(layout).not.toMatch(/\bmaximumScale\b/);
    expect(layout).not.toMatch(/\buserScalable\s*:\s*false\b/);
  });
});
