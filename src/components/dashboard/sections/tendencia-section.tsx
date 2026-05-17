import { AreaTendencia } from "@/components/dashboard/charts/area-tendencia";
import { PontoTendencia } from "@/types/dashboard";

interface TendenciaSectionProps {
  pontos: PontoTendencia[];
}

export function TendenciaSection({ pontos }: TendenciaSectionProps) {
  return (
    <div>
      <SectionHeader title="Últimos 6 Meses" />
      <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <AreaTendencia pontos={pontos} />
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
