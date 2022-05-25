import { CreateInvoiceEntryForm } from "../../Foms/InvoiceEntry/CreateInvoiceEntryForm";
import { Modal } from "../Modal";

interface Props {
  card_id: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateInvoiceEntryModal = ({ card_id, isOpen, onClose, refetch }: Props) => {
return (
  <Modal
      header="Novo Lançamento no Cartão de Crédito"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateInvoiceEntryForm
        card_id={card_id}
        onCancel={onClose}
        refetch={refetch}
      />
  </Modal>
)
}