import { BarTopCategorias } from "@/components/dashboard/charts/bar-top-categorias";
import { TopCategoriaSaida } from "@/types/dashboard";

interface TopCategoriasSectionProps {
  top10: TopCategoriaSaida[];
}

export function TopCategoriasSection({ top10 }: TopCategoriasSectionProps) {
  return (
    <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-4 rounded-full bg-purple-500" />
        <h3 className="text-sm font-semibold text-gray-200">Top 10 Gastos</h3>
      </div>
      {top10.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhum gasto registrado no período selecionado.
        </p>
      ) : (
        <BarTopCategorias top10={top10} />
      )}
    </div>
  );
}
