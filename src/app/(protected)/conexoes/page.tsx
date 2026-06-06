"use client";

import { useState } from "react";
import { Users, Clock } from "lucide-react";
import { Card } from "@/components/primitives/card";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { cn } from "@/helpers/string-helper";
import { useConexoesPendentes } from "@/hooks/use-conexoes-pendentes";
import ConexoesTab from "./conexoes-tab";
import SolicitacoesPendentesTab from "./solicitacoes-pendentes-tab";
import BuscarEConectarModal from "./buscar-e-conectar-modal";

type Tab = "conexoes" | "pendentes";

export default function ConexoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("conexoes");
  const [modalOpen, setModalOpen] = useState(false);

  const { data } = useConexoesPendentes();
  const pendentesCount = data?.length ?? 0;

  return (
    <>
      <ResponsivePageTitle title="Conexões" />

      <Card.Root>
        <div className="flex border-b border-default-border px-6 pt-4">
          <button
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2",
              activeTab === "conexoes"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-200"
            )}
            onClick={() => setActiveTab("conexoes")}
          >
            <Users className="w-4 h-4" />
            Minhas Conexões
          </button>

          <button
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2",
              activeTab === "pendentes"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-200"
            )}
            onClick={() => setActiveTab("pendentes")}
          >
            <Clock className="w-4 h-4" />
            Solicitações
            {pendentesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-semibold">
                {pendentesCount}
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "conexoes" ? (
            <ConexoesTab onBuscarContatos={() => setModalOpen(true)} />
          ) : (
            <SolicitacoesPendentesTab />
          )}
        </div>
      </Card.Root>

      <BuscarEConectarModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
