export const DEFAULT_ERROR_MESSAGE =
  "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";

export const AUTH_COOKIE_NAME = "meudinherim.token";
export const AUTH_PUBLIC_ROUTES = [
  "/login",
  "/cadastrar-usuario",
  "/recuperar-senha",
  "/validar-codigo",
  "/confirmar-email",
  "/reenviar-email-confirmacao",
  "/resetar-senha",
];

export const AUTH_REDIRECT_WHEN_AUTHENTICATED = "/";
export const AUTH_REDIRECT_WHEN_UNAUTHENTICATED = "/login";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8080";
}
