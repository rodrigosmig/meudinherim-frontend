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
  useDisclosure,
  Box
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
import { CreateCategoryModal } from "../../../Modals/categories/CreateCategoryModal";
import { CreateInvoiceEntryModal } from "../../../Modals/invoice_entries/CreateInvoiceEntryModal";
import { CreateAccountEntryModal } from "../../../Modals/account_entries/CreateAccountEntryModal";
import { CreatePaymentModal } from "../../../Modals/payables/CreatePaymentModal";
import { CreateReceivableModal } from "../../../Modals/receivables/CreateReceivableModal";

export const NavAdd = () => {
  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: isOpenTransfer, onOpen: onOpenTransfer, onClose: onCloseTransfer } = useDisclosure();
  const { isOpen: isOpenInvoiceEntry, onOpen: onOpenInvoiceEntry, onClose: onCloseInvoiceEntry } = useDisclosure();
  const { isOpen: isOpenAccountEntry, onOpen: onOpenAccountEntry, onClose: onCloseAccountEntry } = useDisclosure();
  const { isOpen: isOpenPayable, onOpen: onOpenPayable, onClose: onClosePayable } = useDisclosure();
  const { isOpen: isOpenReceivable, onOpen: onOpenReceivable, onClose: onCloseReceivable } = useDisclosure();

  return (
    <Box>
      <CreateInvoiceEntryModal
        isOpen={isOpenInvoiceEntry} 
        onClose={onCloseInvoiceEntry}
      />

      <CreateAccountEntryModal
        isOpen={isOpenAccountEntry} 
        onClose={onCloseAccountEntry}
      />

      <CreateCategoryModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />

      <CreateReceivableModal
        isOpen={isOpenReceivable} 
        onClose={onCloseReceivable}
      />

      <CreatePaymentModal
        isOpen={isOpenPayable} 
        onClose={onClosePayable}
      />

      <TransferBetweenAccountsModal
        isOpen={isOpenTransfer} 
        onClose={onCloseTransfer}
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
          width={['full']}
        >
          <PopoverArrow />
          <PopoverHeader>
            <Center>
              Adicionar
            </Center>
          </PopoverHeader>
          <PopoverBody>
            <NavAddItem
              label="Lançamento no cartão"
              icon={<Icon as={FaCreditCard} fontSize={[18, 20, 20]} />}
              onClick={onOpenInvoiceEntry}
            />

            <NavAddItem
              label="Lançamento na conta"
              icon={<Icon as={RiBankLine} fontSize={20} />}
              onClick={onOpenAccountEntry}
            />

            <NavAddItem
              label="Categoria"
              icon={<Icon as={RiPriceTag3Line} fontSize={20} />}
              onClick={createModalOnOpen}
              />
            
            <NavAddItem
              label="Contas a receber"
              icon={<Icon as={GiReceiveMoney} fontSize={20} />}
              onClick={onOpenReceivable}
              />

            <NavAddItem
              label="Contas a pagar"
              icon={<Icon as={GiPayMoney} fontSize={20} />}
              onClick={onOpenPayable}
            />

            <NavAddItem
              label="Transferência entre contas"
              icon={<Icon as={BiTransfer} fontSize={20} />}
              onClick={onOpenTransfer}
            />
            </PopoverBody>
        </PopoverContent>
      </Popover>    
    </Box>
  )
}