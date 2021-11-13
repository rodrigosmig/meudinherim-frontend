import { EditReceivableForm } from "../../Foms/receivable/EditReceivableForm";
import { Modal } from "../Modal";

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface EditReceivableModalProps {
  receivable: Receivable;
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditReceivableModal = ({ receivable, categories, isOpen, onClose, refetch }: EditReceivableModalProps) => {
  return (
    <Modal
      header="Editar Conta a Receber"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditReceivableForm 
        receivable={receivable}
        categories={categories}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}