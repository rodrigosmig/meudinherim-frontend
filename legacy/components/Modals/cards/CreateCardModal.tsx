import { CreateCardForm } from "../../Foms/card/CreateCardForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCardModal = ({ isOpen, onClose }: Props) => {
return (
  <Modal
    header="Novo Cartão de Crédito"
    isOpen={isOpen}
    onClose={onClose}
  >
    <CreateCardForm
      onClose={onClose}
    />
  </Modal>
)
}