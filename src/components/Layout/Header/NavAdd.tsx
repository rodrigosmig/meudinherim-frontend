import {  
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip
} from "@chakra-ui/react";
import {
  RiPriceTag3Line, 
  RiBankCard2Line, 
  RiBankLine 
} from "react-icons/ri";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { RiAddCircleLine } from "react-icons/ri";
import Link from 'next/link'

export const NavAdd = () => {
  return (
    <Menu isLazy>
      <Tooltip label="Adicionar" bg="pink.600">
        <MenuButton>
          <Icon as={RiAddCircleLine} fontSize="20" />
        </MenuButton>
      </Tooltip>
      <MenuList color='gray.900'>
        <MenuItem icon={<Icon as={RiBankCard2Line} fontSize={20} />}>
          Lançamento no cartão
        </MenuItem>
        <Link href={"/accounts/entries/create"} passHref>
          <MenuItem icon={<Icon as={RiBankLine} fontSize={20} />}>
            Lançamento na conta
          </MenuItem>
        </Link>
        <Link href={"/categories/create"} passHref>
          <MenuItem icon={<Icon as={RiPriceTag3Line} fontSize={20} />}>
            Categoria
          </MenuItem>
        </Link>
        <MenuItem icon={<Icon as={GiReceiveMoney} fontSize={20} />}>
          Conta a receber
        </MenuItem>
        <Link href={"#"} passHref>
          <MenuItem icon={<Icon as={GiPayMoney} fontSize={20} />}>
            Conta a pagar
          </MenuItem>
        </Link>

      </MenuList>
    </Menu>
    
    


  )
}