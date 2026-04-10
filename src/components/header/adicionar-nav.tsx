"use client";

import { Urls } from "@/helpers/urls";
import { useMobile } from "@/hooks/use-is-mobile";
import { BanknoteArrowDown, BanknoteArrowUp, Bookmark, CreditCard, Landmark, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";

interface AdicionarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function AdicionarItem({ href, icon: Icon, label }: AdicionarItemProps) {
  return (
    <DropdownMenu.Item>
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover hover:text-white transition-colors duration-150 group w-full"
      >
        <div className="w-7 h-7 rounded-md bg-gray-700/70 group-hover:bg-primary/15 flex items-center justify-center transition-colors duration-150 shrink-0">
          <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors duration-150" />
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white leading-tight">{label}</span>
      </Link>
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Adicionar">
          <Icon icon={Plus} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-52">
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-border-muted mb-1">
          <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
            <Plus className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-semibold text-gray-200">Adicionar</span>
        </div>

        <SectionLabel label="Lançamentos" />
        <AdicionarItem href={Urls.CARTAO_DE_CREDITO} icon={CreditCard} label="Lançamento no cartão" />

        <AdicionarItem href={Urls.CONTAS_BANCARIAS} icon={Landmark} label="Lançamento na conta" />

        <div className="my-1.5 h-px bg-divider mx-2" />

        <SectionLabel label="Cadastros" />
        <AdicionarItem href={Urls.CATEGORIAS} icon={Bookmark} label="Categoria" />

        <div className="my-1.5 h-px bg-divider mx-2" />

        <SectionLabel label="Agendamentos" />
        <AdicionarItem href={Urls.CONTAS_A_PAGAR} icon={BanknoteArrowDown} label="Contas a Pagar" />
        <AdicionarItem href={Urls.CONTAS_A_RECEBER} icon={BanknoteArrowUp} label="Contas a Receber" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
