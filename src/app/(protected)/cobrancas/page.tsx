"use client";

import { useState } from "react";

import FiltroPorPagina from "@/components/filtro-por-pagina";
import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { Card } from "@/components/primitives/card";
import { Select } from "@/components/primitives/select";
import Skeleton from "@/components/primitives/skeleton";

import { useDateFilter } from "@/hooks/use-date-filter";

import { cn } from "@/helpers/string-helper";

import { StatusCobranca } from "@/types/enum/status-cobranca";

import CobrancasEmitidasTab from "./cobrancas-emitidas-tab";
import CobrancasRecebidasTab from "./cobrancas-recebidas-tab";

type Tab = "recebidas" | "emitidas";

const STATUS_OPTIONS = [
  { value: StatusCobranca.ABERTO, label: "Abertas" },
  { value: StatusCobranca.PAGO, label: "Pagas" },
  { value: StatusCobranca.CANCELADA, label: "Canceladas" },
];

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative cursor-pointer",
        active
          ? "text-primary border-b-2 border-primary -mb-px"
          : "text-gray-400 hover:text-gray-200",
      )}
    >
      {children}
    </button>
  );
}

export default function CobrancasPage() {
  const [activeTab, setActiveTab] = useState<Tab>("recebidas");
  const [perPage, setPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusCobranca>(
    StatusCobranca.ABERTO,
  );

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } =
    useDateFilter();

  function handleChangeStatus(value: string | string[] | undefined) {
    setStatusFilter(value as StatusCobranca);
  }

  function handleChangeTab(tab: Tab) {
    setActiveTab(tab);
  }

  return (
    <>
      <ResponsivePageTitle title="Cobranças" />

      <Card.Root>
        <Card.Header>
          <div className="flex flex-col gap-4">
            <div className="flex border-b border-default-border">
              <TabButton
                active={activeTab === "recebidas"}
                onClick={() => handleChangeTab("recebidas")}
              >
                Recebidas
              </TabButton>
              <TabButton
                active={activeTab === "emitidas"}
                onClick={() => handleChangeTab("emitidas")}
              >
                Emitidas
              </TabButton>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <FiltroPorPeriodo
                selectedRange={dateRange}
                onRangeChange={handleChangeDateFilter}
                onClickFilter={handleOnClickFilter}
              />

              <Select
                options={STATUS_OPTIONS}
                placeholder="Status"
                value={statusFilter}
                onChange={handleChangeStatus}
              />

              <FiltroPorPagina value={perPage} onChange={setPerPage} />
            </div>
          </div>
        </Card.Header>

        {activeTab === "recebidas" && (
          <CobrancasRecebidasTab
            inicio={stringDateUS.from}
            fim={stringDateUS.to}
            status={statusFilter}
            perPage={perPage}
          />
        )}
        {activeTab === "emitidas" && (
          <CobrancasEmitidasTab
            inicio={stringDateUS.from}
            fim={stringDateUS.to}
            status={statusFilter}
            perPage={perPage}
          />
        )}
      </Card.Root>
    </>
  );
}
