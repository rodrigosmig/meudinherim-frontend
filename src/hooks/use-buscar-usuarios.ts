import { conexoesService } from "@/services/conexoes-service";
import { Usuario } from "@/types/conexao";
import { useQuery } from "@tanstack/react-query";

export function useBuscarUsuarios(q: string) {
  return useQuery({
    queryKey: ["buscar_usuarios", q],
    queryFn: async () => {
      const response = await conexoesService.buscarUsuarios(q);
      return response.data as Usuario[];
    },
    enabled: q.trim().length >= 2,
    staleTime: 1000 * 30,
  });
}
