"use client";

import LancamentoCartaoForm from "@/app/(protected)/cartoes-de-credito/[idCartao]/faturas/[idFatura]/lancamentos/lancamento-cartao-form";
import CategoriaForm from "@/app/(protected)/categorias/categoria-form";
import ContaAPagarForm from "@/app/(protected)/contas-a-pagar/conta-a-pagar-form";
import ContaAReceberForm from "@/app/(protected)/contas-a-receber/conta-a-receber-form";
import LancamentoContaForm from "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/lancamento-conta-form";
import OrcamentoForm from "@/app/(protected)/orcamentos/orcamento-form";
import { useMobile } from "@/hooks/use-is-mobile";
import { BanknoteArrowDown, BanknoteArrowUp, Bookmark, CreditCard, Landmark, PiggyBank, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";

type FormAberto =
  | "lancamento-cartao"
  | "lancamento-conta"
  | "categoria"
  | "orcamento"
  | "conta-a-pagar"
  | "conta-a-receber"
  | null;

interface AdicionarItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function AdicionarItem({ icon: IconComp, label, onClick }: AdicionarItemProps) {
  return (
    <DropdownMenu.Item>
      <button
        type="button"
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover hover:text-white transition-colors duration-150 group w-full"
        onClick={onClick}
      >
        <div className="w-7 h-7 rounded-md bg-gray-700/70 group-hover:bg-primary/15 flex items-center justify-center transition-colors duration-150 shrink-0">
          <IconComp className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors duration-150" />
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white leading-tight">{label}</span>
      </button>
    </DropdownMenu.Item>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 pb-1 pt-2">
      {label}
    </p>
  );
}

export function AdicionarNav() {
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const [formAberto, setFormAberto] = useState<FormAberto>(null);

  function fecharForm(open: boolean) {
    if (!open) setFormAberto(null);
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="icon" aria-label="Adicionar">
            <Icon icon={Plus} />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align={align} className="w-64">
          <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-border-muted mb-1">
            <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
              <Plus className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-semibold text-gray-200">Adicionar</span>
          </div>

          <SectionLabel label="Lançamentos" />
          <AdicionarItem icon={CreditCard} label="Lançamento no cartão" onClick={() => setFormAberto("lancamento-cartao")} />
          <AdicionarItem icon={Landmark} label="Lançamento na conta" onClick={() => setFormAberto("lancamento-conta")} />

          <div className="my-1.5 h-px bg-divider mx-2" />

          <SectionLabel label="Cadastros" />
          <AdicionarItem icon={Bookmark} label="Categoria" onClick={() => setFormAberto("categoria")} />
          <AdicionarItem icon={PiggyBank} label="Orçamento" onClick={() => setFormAberto("orcamento")} />

          <div className="my-1.5 h-px bg-divider mx-2" />

          <SectionLabel label="Agendamentos" />
          <AdicionarItem icon={BanknoteArrowDown} label="Contas a Pagar" onClick={() => setFormAberto("conta-a-pagar")} />
          <AdicionarItem icon={BanknoteArrowUp} label="Contas a Receber" onClick={() => setFormAberto("conta-a-receber")} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <LancamentoCartaoForm
        open={formAberto === "lancamento-cartao"}
        onOpenChange={fecharForm}
      />
      <LancamentoContaForm
        open={formAberto === "lancamento-conta"}
        onOpenChange={fecharForm}
      />
      <CategoriaForm
        open={formAberto === "categoria"}
        onOpenChange={fecharForm}
      />
      <OrcamentoForm
        open={formAberto === "orcamento"}
        onOpenChange={fecharForm}
      />
      <ContaAPagarForm
        open={formAberto === "conta-a-pagar"}
        onOpenChange={fecharForm}
      />
      <ContaAReceberForm
        open={formAberto === "conta-a-receber"}
        onOpenChange={fecharForm}
      />
    </>
  );
}
