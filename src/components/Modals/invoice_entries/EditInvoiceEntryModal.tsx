import { IInvoiceEntry } from "../../../types/invoiceEntry";
import { EditInvoiceEntryForm } from "../../Foms/InvoiceEntry/EditInvoiceEntryForm";
import { Modal } from "../Modal";

interface Props {
  entry: IInvoiceEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditInvoiceEntryModal = ({ entry, isOpen, onClose, refetch }: Props) => {
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