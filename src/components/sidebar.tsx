'use client';

import * as Collapsible from "@radix-ui/react-collapsible";
import { ArrowLeftToLine, ArrowRightToLine, BanknoteArrowDown, BanknoteArrowUp, Bookmark, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, CreditCard, Landmark, LayoutDashboard, Menu, Tags, User, X } from 'lucide-react';
import { ElementType, ReactNode, useState } from 'react';

import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from './logo';
import { Button } from "./primitives/button";

function SidebarRoot() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
          className={cn(
            "h-full flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 fixed z-50 top-0 left-0 w-80",
            open ? 'translate-x-0' : '-translate-x-full',
            collapsed ? 'md:w-20' : 'md:w-80',
            "md:static md:translate-x-0",
          )}
          style={{ minHeight: '100vh' }}
        >
          <div className="shrink-0 relative">
            <Logo collapsed={collapsed} />

            <Button
              type="button"
              variant="collapse"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {collapsed ? <ArrowRightToLine className="w-4 h-4" /> : <ArrowLeftToLine className="w-4 h-4" />}
            </Button>
          </div>
          <Collapsible.Content forceMount className="flex flex-col h-full">
            <nav className={cn("flex-1 overflow-y-auto p-4 space-y-1", collapsed && "px-2")}>
              <NavSection title="Geral" collapsed={collapsed}>
                <NavItem link="/" title="Dashboard" icon={LayoutDashboard} collapsed={collapsed} />
                <NavItem link="/categorias" title="Categorias" icon={Bookmark} collapsed={collapsed} />
                <NavItem link="#" title="Perfil" icon={User} collapsed={collapsed} />
                <NavItem link="#" title="Tags" icon={Tags} collapsed={collapsed} />
              </NavSection>
              <NavSection title="Contas" collapsed={collapsed}>
                <NavItem link="#" title="Contas Bancárias" icon={Landmark} collapsed={collapsed} />
              </NavSection>
              <NavSection title="Cartão de Crédito" collapsed={collapsed}>
                <NavItem link="#" title="Cartões de Crédito" icon={CreditCard} collapsed={collapsed} />
              </NavSection>
              <NavSection title="Agendamento" collapsed={collapsed}>
                <NavItem link="#" title="Contas a Pagar" icon={BanknoteArrowDown} collapsed={collapsed} />
                <NavItem link="#" title="Contas a Receber" icon={BanknoteArrowUp} collapsed={collapsed} />
              </NavSection>
              <NavSection title="Relatórios" collapsed={collapsed}>
                <NavItem link="#" title="Contas a Pagar/Receber" icon={ChartNoAxesColumnIncreasing} collapsed={collapsed} />
                <NavItem link="#" title="Lançamentos por categoria" icon={ChartNoAxesCombined} collapsed={collapsed} />
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
  collapsed?: boolean;
  children?: ReactNode;
}

function NavSection({ title, collapsed = false, children }: NavSectionProps) {
  return (
    <div className={cn("mb-4", collapsed && "mb-2")}>
      {!collapsed && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">{title}</p>}
      {children}
    </div>
  )
}

interface NavItemProps {
  title: string;
  link: string;
  icon: ElementType;
  collapsed?: boolean;
}

function NavItem({ title, link, icon: Icon, collapsed = false }: NavItemProps) {
  return (
    <Link
      href={link}
      title={collapsed ? title : undefined}
      aria-label={collapsed ? title : undefined}
      className={cn(
        "sidebar-item active flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-violet-600/10 hover:border-l-3 border-violet-500 transition-all duration-200 ease-in-out",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span className="font-medium">{title}</span>}
    </Link>
  )
}

export const Sidebar = SidebarRoot;