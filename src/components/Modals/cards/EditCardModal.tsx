import { ICard } from "../../../types/card";
import { EditCardForm } from "../../Foms/card/EditCardForm";
import { Modal } from "../Modal";

interface Props {
  card: ICard;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditCardModal = ({ card, isOpen, onClose, refetch }: Props) => {
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