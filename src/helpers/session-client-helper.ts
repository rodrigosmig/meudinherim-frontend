export const validarAutenticacao = (response: Response) => {
  if (response.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Não autenticado");
  }
};
