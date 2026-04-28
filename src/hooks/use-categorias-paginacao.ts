import { CATEGORIAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { categoriasService } from "@/services/categorias-service";
import { Status } from "@/types/enum/status";
import { useQuery } from "@tanstack/react-query";

export function useCategoriasPaginacao(
  page: number,
  perPage: number,
  tipo: string,
  status: Status | "",
) {
  return useQuery({
    queryKey: [CATEGORIAS_QUERY_KEY, page, perPage, tipo, status],
    queryFn: async () => {
      const response = await categoriasService.listar({
        tipo,
        status: status,
        comPaginacao: true,
        pagina: page,
        size: perPage,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
}
