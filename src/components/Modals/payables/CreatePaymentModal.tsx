import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react";
import { CreatePayableForm } from "../../Foms/payable/CreatePayableForm";

  
interface CreatePayableModalProps {
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreatePaymentModal = ({ categories, isOpen, onClose, refetch }: CreatePayableModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Nova Conta a Pagar</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <CreatePayableForm
            categories={categories} 
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}