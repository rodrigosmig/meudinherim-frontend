import { cn } from "@/helpers/string-helper";
import { StatusCobranca } from "@/types/enum/status-cobranca";

const STATUS_CLASSES: Record<StatusCobranca, string> = {
  [StatusCobranca.ABERTO]: "bg-yellow-500/15 text-yellow-400",
  [StatusCobranca.PAGO]: "bg-green-500/15 text-green-400",
  [StatusCobranca.CANCELADA]: "bg-gray-500/15 text-gray-400",
};

const STATUS_LABELS: Record<StatusCobranca, string> = {
  [StatusCobranca.ABERTO]: "Aberto",
  [StatusCobranca.PAGO]: "Pago",
  [StatusCobranca.CANCELADA]: "Cancelado",
};

export function StatusBadge({ status }: { status: StatusCobranca }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
