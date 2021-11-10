import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditCategoryForm } from "../../Foms/categories/EditCategoryForm";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface EditPayableModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditCategoryModal = ({ category, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Editar Categoria</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <EditCategoryForm
            category={category}
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}