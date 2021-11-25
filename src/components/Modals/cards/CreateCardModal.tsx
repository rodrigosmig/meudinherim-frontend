import { CreateAccountForm } from "../../Foms/account/CreateAccountForm";
import { CreateCardForm } from "../../Foms/card/CreateCardForm";
import { Modal } from "../Modal";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateCardModal = ({ isOpen, onClose, refetch }: CreateCategoryModalProps) => {
return (
  <Modal
    header="Novo Cartão de Crédito"
    isOpen={isOpen}
    onClose={onClose}
  >
    <CreateCardForm
      closeModal={onClose}
      refetch={refetch}
    />
  </Modal>
)
}