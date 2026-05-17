'use client';

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DonutsSection } from "@/components/dashboard/sections/donuts-section";
import { ProgressoSection } from "@/components/dashboard/sections/progresso-section";
import { ResumoSection } from "@/components/dashboard/sections/resumo-section";
import { TendenciaSection } from "@/components/dashboard/sections/tendencia-section";
import { TopCategoriasSection } from "@/components/dashboard/sections/top-categorias-section";
import { Header } from "@/components/header/header";
import { Button } from "@/components/primitives/button";
import Heading from "@/components/primitives/heading";
import Loading from "@/components/primitives/loading";
import QueryListState from "@/components/primitives/query-list-state";
import { useDashboard } from "@/hooks/use-dashboard";
import { addMonths, format, getYear, subMonths } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const mesAtual = format(dataAtual, 'LLLL', { locale: ptBR });
  const anoAtual = getYear(dataAtual);
  const mes = dataAtual.getMonth() + 1;
  const ano = getYear(dataAtual);

  const { data, isLoading, isFetching, isError } = useDashboard(mes, ano);

  const handlePreviousMonth = () => setDataAtual(subMonths(dataAtual, 1));
  const handleNextMonth = () => setDataAtual(addMonths(dataAtual, 1));

  return (
    <div className="space-y-6">
      <Header.Title>
        <PageTitle
          mes={mesAtual}
          ano={anoAtual}
          isLoading={isLoading || isFetching}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </Header.Title>

      <div className="mb-2 flex justify-between md:hidden">
        <PageTitle
          mes={mesAtual}
          ano={anoAtual}
          isLoading={isLoading || isFetching}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <QueryListState
        isLoading={isLoading}
        isError={isError}
        loadingFallback={<DashboardSkeleton />}
      >
        {data && (
          <div className="space-y-6">
            <ResumoSection resumo={data.resumoMes} />
            <DonutsSection categorias={data.categorias} />
            <TendenciaSection pontos={data.tendencia.pontos} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopCategoriasSection top10={data.topCategorias.top10Saidas} />
              <ProgressoSection progressoCategorias={data.progressoCategorias} />
            </div>
          </div>
        )}
      </QueryListState>
    </div>
  );
}

interface PageTitleProps {
  mes: string;
  ano: number;
  isLoading?: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

function PageTitle({ mes, ano, isLoading, onPreviousMonth, onNextMonth }: PageTitleProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Heading variant="heading3" className="first-letter:capitalize">{mes}, {ano}</Heading>
        {isLoading && <Loading />}
      </div>
      <div className="flex gap-2 md:pl-2">
        <Button variant="icon" aria-label="Voltar" tooltip="Mês anterior" onClick={onPreviousMonth}>
          <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </Button>
        <Button variant="icon" aria-label="Avançar" tooltip="Mês seguinte" onClick={onNextMonth}>
          <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
        </Button>
      </div>
    </>
  );
}
