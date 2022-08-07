import { PartialPaymentForm } from "../../Foms/invoice/PartialPaymentForm";
import { Modal } from "../Modal";

interface Props {
  cardId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PartialPaymentModal = ({ cardId, isOpen, onClose }: Props) => {
return (
  <Modal
    header="Pagamento Parcial da Fatura"
    isOpen={isOpen}
    onClose={onClose}
  >
    <PartialPaymentForm
      cardId={cardId}
      onCancel={onClose}
    />
  </Modal>
)
}