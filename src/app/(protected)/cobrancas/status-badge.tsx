import { StatusCobranca } from "@/types/enum/status-cobranca";

export function StatusBadge({ status }: { status: StatusCobranca }) {
  if (status === StatusCobranca.ABERTO) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">
        Aberto
      </span>
    );
  }
  if (status === StatusCobranca.PAGO) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400">
        Pago
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400">
      Cancelado
    </span>
  );
}
