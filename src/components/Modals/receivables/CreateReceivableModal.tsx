import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CreateReceivableForm } from "../../Foms/receivable/CreateReceivableForm";

interface CreateReceivableModalProps {
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateReceivableModal = ({ categories, isOpen, onClose, refetch }: CreateReceivableModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Nova Conta a Receber</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <CreateReceivableForm 
            categories={categories} 
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}