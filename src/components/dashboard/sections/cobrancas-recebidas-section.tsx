import Link from "next/link";

import Skeleton from "@/components/primitives/skeleton";
import { useCobrancasRecebidas } from "@/hooks/use-cobrancas-recebidas";
import { toCurrency } from "@/helpers/string-helper";
import { StatusCobranca } from "@/types/enum/status-cobranca";

export function CobrancasRecebidasSection() {
  const { data, isLoading, isError } = useCobrancasRecebidas();

  const abertas = (data ?? []).filter((c) => c.status === StatusCobranca.ABERTO);

  return (
    <div className="bg-gray-800/70 border border-gray-700/40 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-amber-500" />
          <h3 className="text-sm font-semibold text-gray-200">Cobranças Recebidas em Aberto</h3>
        </div>
        <Link
          href="/cobrancas"
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
        >
          Ver todas →
        </Link>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-gray-500 text-center py-4">
          Não foi possível carregar as cobranças.
        </p>
      )}

      {!isLoading && !isError && abertas.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhuma cobrança recebida em aberto.
        </p>
      )}

      {!isLoading && !isError && abertas.length > 0 && (
        <ul className="divide-y divide-gray-700/40">
          {abertas.map((c) => (
            <li key={c.uuid} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-200 truncate">{c.cobrador.nome}</span>
                <span className="text-xs text-gray-500 truncate">{c.descricao}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {c.gerouContaAPagar ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400">
                    Conta gerada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">
                    Pendente
                  </span>
                )}
                <span className="text-sm font-bold text-gray-200">{toCurrency(c.valor)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
