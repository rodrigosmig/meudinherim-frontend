import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditAccountForm } from "../../Foms/account/EditAccountForm";

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface EditPayableModalProps {
  account: Account;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditAccountModal = ({ account, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Editar Categoria</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <EditAccountForm
            account={account}
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}