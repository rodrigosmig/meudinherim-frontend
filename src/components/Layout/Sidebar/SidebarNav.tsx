
import { Stack } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import { HiDocumentReport } from "react-icons/hi";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import {
  RiPriceTag3Line, 
  RiBankCard2Line, 
  RiDashboardLine, 
  RiBankLine 
} from "react-icons/ri";

export const SidebarNav = () => {
  return (
    <>
      <Stack spacing="8" align="flex-start">
        <NavSection title="Geral" >
          <NavLink href="/dashboard" icon={RiDashboardLine}>Dashboard</NavLink>
          <NavLink href="/categories" icon={RiPriceTag3Line}>Categorias</NavLink>
        </NavSection>

        <NavSection title="Banco">
            <NavLink href="/accounts" icon={RiBankLine}>Contas</NavLink>
        </NavSection>
      
        <NavSection title="Cartão de Crédito">
            <NavLink href="#" icon={RiBankCard2Line}>Cartão de Crédito</NavLink>
            <NavLink href="#" icon={RiBankCard2Line}>Faturas</NavLink>
        </NavSection>

        <NavSection title="Agendamento">
            <NavLink href="/receivables" icon={GiReceiveMoney}>Contas a Receber</NavLink>
            <NavLink href="/payables" icon={GiPayMoney}>Contas a Pagar</NavLink>
        </NavSection>


        <NavSection title="Relatórios">
            <NavLink href="#" icon={HiDocumentReport}>Relatórios</NavLink>
        </NavSection>
        
      </Stack>
    </>
  )
}