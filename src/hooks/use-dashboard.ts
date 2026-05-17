import { DASHBOARD_QUERY_KEY } from "@/helpers/query-keys-helper";
import { dashboardService } from "@/services/dashboard-service";
import { useQuery } from "@tanstack/react-query";

export function useDashboard(mes: number, ano: number) {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, mes, ano],
    queryFn: () => dashboardService.obterDados(mes, ano),
    staleTime: 1000 * 60 * 15,
  });
}
