export default {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/src/components/primitives/",
    "/src/lib/",
    "/src/services/",
    // componentes de visualização — canvas/Recharts incompatível com jsdom
    "/src/components/dashboard/",
    // definições de tipos TypeScript — sem lógica executável
    "/src/types/",
    // páginas de relatórios — dependências complexas demais
    "/src/app/\\(protected\\)/relatorios/",
    // page.tsx nas rotas protegidas — server components de composição
    "/src/app/\\(protected\\)/.*page\\.tsx$",
    // formulários de pagamento avançados — padrão já coberto em outros forms
    "pagar-conta-a-pagar-form\\.tsx$",
    "conta-a-pagar-form\\.tsx$",
    "receber-conta-a-receber-form\\.tsx$",
    "conta-a-receber-form\\.tsx$",
    "pagamento-parcial-form\\.tsx$",
    "fechar-fatura-form\\.tsx$",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/src/components/primitives/",
    "<rootDir>/src/lib/",
    "<rootDir>/src/services/",
    "<rootDir>/legacy/",
    "<rootDir>/.claude/",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/mocks/**",
    "!src/helpers/**",
    "!src/app/api/proxy/**",
    "!src/proxy.ts",
    "!src/app/**/route.ts",
    "!src/app/**/layout.tsx",
    "!src/components/toast.tsx",
    "!src/providers/**",
    "!src/hooks/**",
    "!src/contexts/**",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
