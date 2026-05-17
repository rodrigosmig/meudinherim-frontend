import { toCurrency } from "@/helpers/string-helper";
import { cn } from "@/helpers/string-helper";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  titulo: string;
  valor: number;
  icone: LucideIcon;
  variante: "entradas" | "saidas" | "saldo" | "cartao";
}

const variantStyles = {
  entradas: {
    border: "border-t-2 border-t-cyan-500",
    icon: "bg-cyan-500/10 text-cyan-400",
    value: "text-cyan-400",
    glow: "shadow-cyan-500/10",
  },
  saidas: {
    border: "border-t-2 border-t-red-400",
    icon: "bg-red-400/10 text-red-400",
    value: "text-red-400",
    glow: "shadow-red-400/10",
  },
  saldo: {
    border: "border-t-2 border-t-purple-500",
    icon: "bg-purple-500/10 text-purple-400",
    value: "text-purple-300",
    glow: "shadow-purple-500/10",
  },
  cartao: {
    border: "border-t-2 border-t-amber-400",
    icon: "bg-amber-400/10 text-amber-400",
    value: "text-amber-400",
    glow: "shadow-amber-400/10",
  },
};

export function MetricCard({ titulo, valor, icone: Icon, variante }: MetricCardProps) {
  const styles = variantStyles[variante];

  return (
    <div
      className={cn(
        "bg-gray-800 rounded-2xl border border-gray-700/50 p-5",
        "shadow-xl",
        styles.border,
        styles.glow,
        "transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5",
        "relative overflow-hidden",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest truncate">
          {titulo}
        </p>
        <div className={cn("shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center", styles.icon)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
        </div>
      </div>

      <p className={cn("text-xl sm:text-2xl font-bold tabular-nums leading-none", styles.value)}>
        {toCurrency(valor)}
      </p>
    </div>
  );
}
