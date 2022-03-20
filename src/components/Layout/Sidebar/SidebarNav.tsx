
import { Stack } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavSection } from './NavSection';
import { HiDocumentReport } from "react-icons/hi";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import {
  RiPriceTag3Line, 
  RiDashboardLine, 
  RiBankLine 
} from "react-icons/ri";

import { FaMoneyBillAlt, FaCreditCard } from 'react-icons/fa'

export const SidebarNav = () => {
  return (
    <>
      <Stack 
        spacing="8" 
        align="flex-start" 
        ml={[0, 4]}
        mb={4}
      >
        <NavSection title="Geral" >
          <NavLink href="/dashboard" icon={RiDashboardLine}>Dashboard</NavLink>
          <NavLink href="/categories" icon={RiPriceTag3Line}>Categorias</NavLink>
        </NavSection>

        <NavSection title="Contas">
          <NavLink href="/accounts" icon={RiBankLine}>Contas</NavLink>
        </NavSection>
      
        <NavSection title="Cartão de Crédito">
          <NavLink href="/cards" icon={FaCreditCard}>Cartão de Crédito</NavLink>
        </NavSection>

        <NavSection title="Agendamento">
          <NavLink href="/receivables" icon={GiReceiveMoney}>Contas a Receber</NavLink>
          <NavLink href="/payables" icon={GiPayMoney}>Contas a Pagar</NavLink>
        </NavSection>


        <NavSection title="Relatórios">
          <NavLink href="/reports/accounts" icon={FaMoneyBillAlt}>Contas a Pagar/Receber</NavLink>
          <NavLink href="/reports/total-by-category" icon={RiPriceTag3Line}>Contas: Total por Categoria</NavLink>
          <NavLink href="/reports/credit-total-by-category" icon={RiPriceTag3Line}>Total de Crédito por Categoria</NavLink>
        </NavSection>
        
      </Stack>
    </>
  )
}