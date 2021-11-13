import { EditCategoryForm } from "../../Foms/categories/EditCategoryForm";
import { Modal } from "../Modal";

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
    <Modal
      header="Editar Categoria"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditCategoryForm
        category={category}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}