import { EditCardForm } from "../../Foms/card/EditCardForm";
import { Modal } from "../Modal";

interface Card {
  id: number;
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

interface EditPayableModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditCardModal = ({ card, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Cartão de Crédito"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditCardForm
        card={card}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}