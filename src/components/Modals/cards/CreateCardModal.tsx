import { CreateCardForm } from "../../Foms/card/CreateCardForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateCardModal = ({ isOpen, onClose, refetch }: Props) => {
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