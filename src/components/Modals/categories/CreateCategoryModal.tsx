import { CreateCategoryForm } from "../../Foms/categories/CreateCategoryForm";
import { Modal } from "../Modal";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, refetch }: CreateCategoryModalProps) => {
return (
  <Modal
      header="Nova Categoria"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateCategoryForm
        onCancel={onClose}
        refetch={refetch}
      />
  </Modal>
)
}