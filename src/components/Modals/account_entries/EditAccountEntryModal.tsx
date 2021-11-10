import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditAccountEntryForm } from "../../Foms/accountEntry/EditAccountEntryForm";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface Account {
  id: number;
  name: string;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  balance: number;
}

interface AccountEntry {
  id: number;
  date: string;
  category: Category;
  description: string;
  value: number;
  account: Account;
}

interface EditAccountEntryModalProps {
  entry: AccountEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditAccountEntryModal = ({ entry, isOpen, onClose, refetch }: EditAccountEntryModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Editar Lançamento</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <EditAccountEntryForm
            entry={entry}
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}