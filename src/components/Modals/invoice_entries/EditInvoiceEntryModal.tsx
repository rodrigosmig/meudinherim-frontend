import { EditInvoiceEntryForm } from "../../Foms/InvoiceEntry/EditInvoiceEntryForm";
import { Modal } from "../Modal";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface InvoiceEntry {
  id: number;
  date: string;
  description: string;
  value: number;
  category: Category;
  card_id: number;
  invoice_id: number;
  is_parcel: boolean;
  parcel_number: number;
  parcel_total: number;
  total_purchase: number;
  parcelable_id: number;
  anticipated: boolean;
}

interface EditInvoiceEntryModalProps {
  entry: InvoiceEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditInvoiceEntryModal = ({ entry, isOpen, onClose, refetch }: EditInvoiceEntryModalProps) => {
  return (
    <Modal
      header="Editar lançamento"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditInvoiceEntryForm
        entry={entry}
        onClose={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}