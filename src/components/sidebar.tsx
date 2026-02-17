'use client';

import * as Collapsible from "@radix-ui/react-collapsible";
import { BanknoteArrowDown, BanknoteArrowUp, Bookmark, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, CreditCard, Landmark, LayoutDashboard, Menu, Tags, User, X } from 'lucide-react';
import { ElementType, ReactNode, useState } from 'react';

import Logo from './logo';
import { Button } from "./primitives/button";

function SidebarRoot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="menu"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        icon={Menu}
        iconClassName='w-6 h-6'
      >
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Collapsible.Root open={open} onOpenChange={setOpen} className="">
        <aside
          className={`
            h-full flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300
            fixed z-50 top-0 left-0
            w-80
            ${open ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0
            md:w-80
          `}
          style={{ minHeight: '100vh' }}
        >
          <div className="shrink-0">
            <Logo />
          </div>
          <Collapsible.Content forceMount className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <NavSection title="Geral">
                <NavItem title="Dashboard" icon={LayoutDashboard} />
                <NavItem title="Categorias" icon={Bookmark} />
                <NavItem title="Perfil" icon={User} />
                <NavItem title="Tags" icon={Tags} />
              </NavSection>
              <NavSection title="Contas">
                <NavItem title="Contas Bancárias" icon={Landmark} />
              </NavSection>
              <NavSection title="Cartão de Crédito">
                <NavItem title="Cartões de Crédito" icon={CreditCard} />
              </NavSection>
              <NavSection title="Agendamento">
                <NavItem title="Contas a Pagar" icon={BanknoteArrowDown} />
                <NavItem title="Contas a Receber" icon={BanknoteArrowUp} />
              </NavSection>
              <NavSection title="Relatórios">
                <NavItem title="Contas a Pagar/Receber" icon={ChartNoAxesColumnIncreasing} />
                <NavItem title="Lançamentos por categoria" icon={ChartNoAxesCombined} />
              </NavSection>
            </nav>
          </Collapsible.Content>

          {/* Botão fechar mobile */}
          <Button
            variant="close"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            style={{ zIndex: 60 }}
          >
            <X className="w-5 h-5" />
          </Button>
        </aside>
      </Collapsible.Root>
    </>
  );
}

interface NavSectionProps {
  title: string;
  children?: ReactNode;
}

function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">{title}</p>
      {children}
    </div>
  )
}

interface NavItemProps {
  title: string;
  icon: ElementType;
}

function NavItem({ title, icon: Icon }: NavItemProps) {
  return (
    <a href="#" className="sidebar-item active flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-violet-600/10 hover:border-l-3 border-violet-500 transition-all duration-200 ease-in-out">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </a>
  )
}

export const Sidebar = SidebarRoot;