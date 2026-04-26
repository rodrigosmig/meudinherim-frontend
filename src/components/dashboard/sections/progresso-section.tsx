import { ProgressoCategoriaCard } from "@/components/dashboard/cards/progress-categoria-card";
import { ProgressoCategoria } from "@/types/dashboard";

interface ProgressoSectionProps {
  progressoCategorias: ProgressoCategoria[];
}

export function ProgressoSection({ progressoCategorias }: ProgressoSectionProps) {
  const comOrcamento = progressoCategorias.filter((item) => item.orcamento !== null);

  return (
    <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-4 rounded-full bg-cyan-500" />
        <h3 className="text-sm font-semibold text-gray-200">Orçamento por Categoria</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {comOrcamento.map((item) => (
          <ProgressoCategoriaCard key={item.categoriaUuid} dado={item} />
        ))}
      </div>
    </div>
  );
}
