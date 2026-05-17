import { handleApiResponse } from "@/helpers/response-helper";
import { AlterarImagemRequest, AlterarImagemResponse, AlterarPerfilRequest, AlterarPerfilResponse, AlterarSenhaRequest, AlterarSenhaResponse } from "@/types/usuario";


export const usuarioService = {
  alterarPerfil: async (
    request: AlterarPerfilRequest,
  ): Promise<AlterarPerfilResponse> => {
    const response = await fetch("/api/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<AlterarPerfilResponse>(response);
  },

  alterarSenha: async (
    request: AlterarSenhaRequest,
  ): Promise<AlterarSenhaResponse> => {
    const response = await fetch("/api/proxy/v1/perfil/senha", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleApiResponse<AlterarSenhaResponse>(response);
  },

  alterarImagem: async (
    request: AlterarImagemRequest,
  ): Promise<AlterarImagemResponse> => {
    const formData = new FormData();
    formData.append("file", request.file);

    const response = await fetch("/api/perfil/avatar", {
      method: "POST",
      body: formData,
    });
    return handleApiResponse<AlterarImagemResponse>(response);
  },
}