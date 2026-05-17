import { validarAutenticacao } from "@/helpers/session-client-helper";
import { ApiResponse } from "@/types/api";
import { DashboardData } from "@/types/dashboard";

export const dashboardService = {
  obterDados: async (mes: number, ano: number): Promise<DashboardData> => {
    const params = new URLSearchParams({
      mes: mes.toString(),
      ano: ano.toString(),
    });

    const url = `/api/proxy/v1/dashboard?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    validarAutenticacao(response);

    if (!response.ok) throw new Error("Falha ao obter dados do dashboard");

    const payload: ApiResponse<DashboardData> = await response.json();

    return payload.data!;
  },
};
