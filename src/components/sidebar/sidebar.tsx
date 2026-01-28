import { BanknoteArrowDown, BanknoteArrowUp, Bookmark, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, CreditCard, Landmark, LayoutDashboard, Tags, User } from 'lucide-react';

import { NavSection } from './nav-section';
import { NavItem } from './nav-item';
import Logo from './logo';

export function Sidebar() {
  return (
    <aside className="h-full w-80 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300">
      <Logo />

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

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-750 rounded-lg text-gray-400 hover:text-gray-300 transition-colors">
          <svg id="collapseIcon" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <span id="collapseText" className="text-sm font-medium">Recolher</span>
        </button>
      </div>
    </aside>
  )
}