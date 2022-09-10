import { IInvoiceEntry } from "../../../types/invoiceEntry";
import { EditInvoiceEntryForm } from "../../Foms/InvoiceEntry/EditInvoiceEntryForm";
import { Modal } from "../Modal";

interface Props {
  entry: IInvoiceEntry;
  isOpen: boolean;
  onClose: () => void;
}

export const EditInvoiceEntryModal = ({ entry, isOpen, onClose}: Props) => {
  return (
    <Modal
      header="Editar lançamento"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditInvoiceEntryForm
        entry={entry}
        onClose={onClose}
      />
    </Modal>
  )
}