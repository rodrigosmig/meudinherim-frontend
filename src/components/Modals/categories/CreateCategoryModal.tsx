import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CreateCategoryForm } from "../../Foms/categories/CreateCategoryForm";
import { CreatePayableForm } from "../../Foms/payable/CreatePayableForm";


interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, refetch }: CreateCategoryModalProps) => {
return (
  <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
    <ModalOverlay />
    <ModalContent bgColor={"gray.800"}>
      <ModalHeader>Nova Conta a Pagar</ModalHeader>
      <ModalCloseButton onClick={onClose} />
      <ModalBody>
        <CreateCategoryForm
          closeModal={onClose}
          refetch={refetch}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
)
}