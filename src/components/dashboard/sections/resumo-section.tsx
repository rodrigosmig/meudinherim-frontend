import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { DashboardResumoMes } from "@/types/dashboard";
import { ArrowDownCircle, ArrowUpCircle, CreditCard, Landmark } from "lucide-react";

interface ResumoSectionProps {
  resumo: DashboardResumoMes;
}

export function ResumoSection({ resumo }: ResumoSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        titulo="Entradas"
        valor={resumo.totalEntradas}
        icone={ArrowUpCircle}
        variante="entradas"
      />
      <MetricCard
        titulo="Saídas"
        valor={resumo.totalSaidas}
        icone={ArrowDownCircle}
        variante="saidas"
      />
      <MetricCard
        titulo="Saldo em Contas"
        valor={resumo.saldoContas}
        icone={Landmark}
        variante="saldo"
      />
      <MetricCard
        titulo="Cartão de Crédito"
        valor={resumo.totalCartaoCredito}
        icone={CreditCard}
        variante="cartao"
      />
    </div>
  );
}
