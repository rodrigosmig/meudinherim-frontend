"use client";

import { useState } from "react";

import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { Card } from "@/components/primitives/card";
import { cn } from "@/helpers/string-helper";

import CobrancasEmitidasTab from "./cobrancas-emitidas-tab";
import CobrancasRecebidasTab from "./cobrancas-recebidas-tab";

type Tab = "emitidas" | "recebidas";

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
  const [activeTab, setActiveTab] = useState<Tab>("emitidas");

  return (
    <>
      <ResponsivePageTitle title="Cobranças" />

      <Card.Root>
        <div className="flex border-b border-default-border">
          <TabButton
            active={activeTab === "emitidas"}
            onClick={() => setActiveTab("emitidas")}
          >
            Emitidas
          </TabButton>
          <TabButton
            active={activeTab === "recebidas"}
            onClick={() => setActiveTab("recebidas")}
          >
            Recebidas
          </TabButton>
        </div>

        {activeTab === "emitidas" && <CobrancasEmitidasTab />}
        {activeTab === "recebidas" && <CobrancasRecebidasTab />}
      </Card.Root>
    </>
  );
}
