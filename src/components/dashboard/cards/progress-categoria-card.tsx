import { toCurrency } from "@/helpers/string-helper";
import { cn } from "@/helpers/string-helper";
import { ProgressoCategoria } from "@/types/dashboard";

interface ProgressoCategoriaCardProps {
  dado: ProgressoCategoria;
}

export function ProgressoCategoriaCard({ dado }: ProgressoCategoriaCardProps) {
  const { categoriaNome, valorGasto, orcamento, percentualUsado } = dado;
  const semOrcamento = orcamento === null;
  const estourado = !semOrcamento && percentualUsado > 100;
  const pct = semOrcamento ? 0 : Math.min(percentualUsado, 100);

  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/40 p-4 hover:border-gray-600/60 transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-sm font-medium text-gray-200 truncate">{categoriaNome}</span>
        {estourado && (
          <span className="flex-shrink-0 text-[10px] font-semibold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">
            Estourado
          </span>
        )}
        {semOrcamento && (
          <span className="flex-shrink-0 text-[10px] font-medium text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded-full">
            Sem orçamento
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 mb-2">
        <span className={cn("text-lg font-bold tabular-nums", estourado ? "text-red-400" : "text-gray-100")}>
          {toCurrency(valorGasto)}
        </span>
        {!semOrcamento && (
          <span className="text-xs text-gray-500 tabular-nums">
            de {toCurrency(orcamento!)}
          </span>
        )}
      </div>

      {!semOrcamento && (
        <div>
          <div className="h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                estourado
                  ? "bg-gradient-to-r from-red-500 to-red-400"
                  : percentualUsado >= 85
                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                  : "bg-gradient-to-r from-purple-600 to-cyan-500",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={cn("text-[10px] mt-1.5 tabular-nums", estourado ? "text-red-400" : "text-gray-500")}>
            {percentualUsado.toFixed(0)}%{estourado ? ` (+${(percentualUsado - 100).toFixed(0)}%)` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
