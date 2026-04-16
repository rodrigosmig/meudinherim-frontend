import { handleApiResponse } from "@/helpers/response-helper";
import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";

export const contasAReceberService = {
  cancelarPagamento: async (
    idContaAReceber: string,
    idParcela?: string,
  ): Promise<ApiResponse<void>> => {
    const params = new URLSearchParams();

    if (idParcela) {
      params.append("idParcela", idParcela);
    }

    const url = `/api/proxy/v1/contas-a-receber/pagamento/cancelar/${idContaAReceber}?${params.toString()}`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    return handleApiResponse<ApiResponse<void>>(response);
  },
};
