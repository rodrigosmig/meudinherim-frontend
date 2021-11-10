import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CreateAccountForm } from "../../Foms/account/CreateAccountForm";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateAccountModal = ({ isOpen, onClose, refetch }: CreateCategoryModalProps) => {
return (
  <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
    <ModalOverlay />
    <ModalContent bgColor={"gray.800"}>
      <ModalHeader>Nova Conta a Pagar</ModalHeader>
      <ModalCloseButton onClick={onClose} />
      <ModalBody>
        <CreateAccountForm
          closeModal={onClose}
          refetch={refetch}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
)
}