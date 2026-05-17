import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { DashboardCategorias } from "@/types/dashboard";

interface DonutsSectionProps {
  categorias: DashboardCategorias;
}

export function DonutsSection({ categorias }: DonutsSectionProps) {
  return (
    <div>
      <SectionHeader title="Distribuição por Categoria" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
          <DonutChart dados={categorias.entradas} titulo="Entradas" accentColor="#22d3ee" />
        </div>
        <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
          <DonutChart dados={categorias.saidas} titulo="Saídas" accentColor="#f87171" />
        </div>
        <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
          <DonutChart dados={categorias.cartao} titulo="Cartão de Crédito" accentColor="#fbbf24" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-700/60 to-transparent" />
    </div>
  );
}
