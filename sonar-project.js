const sonarqubeScanner = require("sonarqube-scanner");

sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    token: process.env.SONARQUBE_TOKEN,
    options: {
      "sonar.projectName": "Meu Dinherim",
      "sonar.sources": "./src",
      "sonar.exclusions": "**/tests/**",
      "sonar.tests": "./src/tests",
      "sonar.test.inclusions": "./src/tests/**/*.spec.tsx,./src/tests/**/*.spec.ts",
      "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
      "sonar.testExecutionReportPaths": "reports/test-report.xml",
    },
  },
  () => {},
);