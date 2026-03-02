import { PROXIMAS_FATURAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { faturaService } from "@/services/faturas-service";
import { useQuery } from "@tanstack/react-query";

export function useProximasFaturas() {
  return useQuery({
    queryKey: [PROXIMAS_FATURAS_QUERY_KEY],
    queryFn: async () => {
      const response = await faturaService.listarProximasFaturas();
      return response.data;
    },
  });
}
