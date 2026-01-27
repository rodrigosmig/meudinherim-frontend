import { CreateCategoryForm } from "../../Foms/categories/CreateCategoryForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCategoryModal = ({ isOpen, onClose }: Props) => {
return (
  <Modal
      header="Nova Categoria"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateCategoryForm
        onClose={onClose}
      />
  </Modal>
)
}