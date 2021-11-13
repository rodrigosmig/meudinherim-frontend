import { EditPayableForm } from "../../Foms/payable/EditPayableForm";
import { Modal } from "../Modal";

interface Payable {
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

interface EditPayableModalProps {
  payable: Payable;
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditPayableModal = ({ payable, categories, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Conta a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditPayableForm
        payable={payable}
        categories={categories}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>

  )
}