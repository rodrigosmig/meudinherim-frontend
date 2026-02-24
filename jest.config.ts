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
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/src/components/primitives/",
    "<rootDir>/src/lib/",
    "<rootDir>/src/services/",
    "<rootDir>/legacy/",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // cobre todos os arquivos da pasta src
    "!src/**/__tests__/**", // ignora pastas de teste
    "!src/**/mocks/**", // ignora mocks
    "!src/helpers/**", // ignora helpers
    "!src/app/api/proxy/**", // ignora middlewares
    "!src/proxy.ts", // ignora middlewares
    "!src/app/**/route.ts", // ignora arquivos de rota
    "!src/app/**/layout.tsx", // ignora arquivos de layout
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
