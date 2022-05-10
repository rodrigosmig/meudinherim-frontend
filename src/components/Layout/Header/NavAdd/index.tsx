import {  
  Center,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Divider,
  useDisclosure
} from "@chakra-ui/react";
import {
  RiBankLine,
  RiAddCircleLine,
  RiPriceTag3Line, 
} from "react-icons/ri";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { FaCreditCard } from 'react-icons/fa'
import { BiTransfer } from "react-icons/bi";
import { NavAddItem } from "./Item";
import { TransferBetweenAccountsModal } from "../../../Modals/account_entries/TransferBetweenAccountsModal";

export const NavAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <TransferBetweenAccountsModal
        isOpen={isOpen} 
        onClose={onClose}
      />

      <Popover
        isLazy 
        trigger={'hover'}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="add menu"
            size="sm"
            variant="ghost"
            icon={<Icon as={RiAddCircleLine} fontSize={[18, 20, 20]} />} 
          />
        </PopoverTrigger>
        
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          rounded={'xl'}
          minW={['xs']}
        >
          <PopoverArrow />
          <PopoverHeader>
            <Center>
              Adicionar
            </Center>
          </PopoverHeader>
          <PopoverBody>
            <NavAddItem
              url="/cards/invoices/entries/create"
              label="Lançamento no cartão"
              icon={<Icon as={FaCreditCard} fontSize={[18, 20, 20]} />}
            />

            <NavAddItem
              url="/accounts/entries/create"
              label="Lançamento na conta"
              icon={<Icon as={RiBankLine} fontSize={20} />}
            />

            <NavAddItem
              url="/categories/create"
              label="Categoria"
              icon={<Icon as={RiPriceTag3Line} fontSize={20} />}
            />
            
            <NavAddItem
              url="/receivables/create"
              label="Contas a receber"
              icon={<Icon as={GiReceiveMoney} fontSize={20} />}
            />

            <NavAddItem
              url="/payables/create"
              label="Contas a pagar"
              icon={<Icon as={GiPayMoney} fontSize={20} />}
            />

            <NavAddItem
              url="#"
              label="Transferência entre contas"
              icon={<Icon as={BiTransfer} fontSize={20} />}
              onClick={onOpen}
            />

            <Divider mt={2} mb={2} />

            </PopoverBody>
        </PopoverContent>
      </Popover>    
    </>
  )
}