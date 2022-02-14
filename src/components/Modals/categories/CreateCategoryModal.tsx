import { CreateCategoryForm } from "../../Foms/categories/CreateCategoryForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, refetch }: Props) => {
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