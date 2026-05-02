'use client';

import * as Collapsible from "@radix-ui/react-collapsible";
import { BanknoteArrowDown, BanknoteArrowUp, Bookmark, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, ChevronLeft, ChevronRight, CreditCard, Landmark, LayoutDashboard, Menu, PiggyBank, Tags, X } from 'lucide-react';
import { ElementType, ReactNode, useState } from 'react';

import { cn } from "@/helpers/string-helper";
import { Urls } from "@/helpers/urls";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "./primitives/button";
import Logo from "./primitives/logo";

function SidebarRoot() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-lg border border-gray-800 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        icon={Menu}
        iconClassName='w-6 h-6'
      >
      </Button>

      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

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

            {!open && (
              <Button
                className="hidden md:block bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:text-primary absolute z-50 rounded-full p-1 top-2 -right-3 transition-colors duration-200"
                type="button"
                variant="icon"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label={collapsed ? "Expandir" : "Recolher"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            )}
          </div>
          <Collapsible.Content forceMount className="flex flex-col h-full">
            <nav className={cn("flex-1 overflow-y-auto p-4 space-y-1", collapsed && "px-2")}>
              <NavSection title="Geral" collapsed={collapsed} isFirst>
                <NavItem link={Urls.DASHBOARD} title="Dashboard" icon={LayoutDashboard} collapsed={collapsed} onNavigate={() => setOpen(false)} />
                <NavItem link={Urls.CATEGORIAS} title="Categorias" icon={Bookmark} collapsed={collapsed} onNavigate={() => setOpen(false)} />
                <NavItem link={Urls.ORCAMENTOS} title="Orçamentos" icon={PiggyBank} collapsed={collapsed} onNavigate={() => setOpen(false)} />
                <NavItem link={Urls.TAGS} title="Tags" icon={Tags} collapsed={collapsed} onNavigate={() => setOpen(false)} />
              </NavSection>
              <NavSection title="Contas" collapsed={collapsed}>
                <NavItem link={Urls.CONTAS_BANCARIAS} title="Contas Bancárias" icon={Landmark} collapsed={collapsed} onNavigate={() => setOpen(false)} />
              </NavSection>
              <NavSection title="Cartão de Crédito" collapsed={collapsed}>
                <NavItem link={Urls.CARTOES_DE_CREDITO} title="Cartões de Crédito" icon={CreditCard} collapsed={collapsed} onNavigate={() => setOpen(false)} />
              </NavSection>
              <NavSection title="Agendamento" collapsed={collapsed}>
                <NavItem link={Urls.CONTAS_A_PAGAR} title="Contas a Pagar" icon={BanknoteArrowDown} collapsed={collapsed} onNavigate={() => setOpen(false)} />
                <NavItem link={Urls.CONTAS_A_RECEBER} title="Contas a Receber" icon={BanknoteArrowUp} collapsed={collapsed} onNavigate={() => setOpen(false)} />
              </NavSection>
              <NavSection title="Relatórios" collapsed={collapsed}>
                <NavItem link={Urls.CONTAS_A_PAGAR_RECEBER} title="Contas a Pagar/Receber" icon={ChartNoAxesColumnIncreasing} collapsed={collapsed} onNavigate={() => setOpen(false)} />
                <NavItem link={Urls.LANCAMENTOS_POR_CATEGORIA} title="Lançamentos por categoria" icon={ChartNoAxesCombined} collapsed={collapsed} onNavigate={() => setOpen(false)} />
              </NavSection>
            </nav>
          </Collapsible.Content>

          <div className={cn("shrink-0 border-t border-gray-800 py-3", collapsed ? "px-2" : "px-4")}>
            <div className="h-1 rounded-full bg-gray-800/80" />
          </div>

          {/* Botão fechar mobile */}
          {open && (
            <Button
              className="absolute top-0 right-0 md:hidden text-gray-400 bg-transparent border-0 hover:text-white font-bold"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              style={{ zIndex: 60 }}
            >
              <X className="w-5 h-5 hover:text-white" />
            </Button>
          )}
        </aside>
      </Collapsible.Root>
    </>
  );
}

interface NavSectionProps {
  title: string;
  collapsed?: boolean;
  children?: ReactNode;
  isFirst?: boolean;
}

function NavSection({ title, collapsed = false, children, isFirst = false }: NavSectionProps) {
  return (
    <div className={cn("mb-4", collapsed && "mb-2", !isFirst && "border-t border-gray-800/60 pt-3")}>
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
  onNavigate?: () => void;
}

function NavItem({ title, link, icon: Icon, collapsed = false, onNavigate }: NavItemProps) {
  const pathname = usePathname();
  const isActive = link === "/" ? pathname === link : pathname.startsWith(link);

  return (
    <Link
      href={link}
      title={collapsed ? title : undefined}
      aria-label={collapsed ? title : undefined}
      onClick={() => onNavigate?.()}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "transition-all duration-200 ease-in-out",
        isActive
          ? "bg-primary/15 text-primary border-l-2 border-primary font-semibold"
          : "text-gray-400 hover:bg-primary/8 hover:text-gray-200",
        collapsed && "justify-center px-0 border-l-0",
      )}
    >
      <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
      {!collapsed && <span className="font-medium">{title}</span>}
    </Link>
  )
}

export const Sidebar = SidebarRoot;
