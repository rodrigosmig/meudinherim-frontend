import { ICategory } from "../../../types/category";
import { EditCategoryForm } from "../../Foms/categories/EditCategoryForm";
import { Modal } from "../Modal";
interface EditPayableModalProps {
  category: ICategory;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCategoryModal = ({ category, isOpen, onClose }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Categoria"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditCategoryForm
        category={category}
        onClose={onClose}
      />
    </Modal>
  )
}