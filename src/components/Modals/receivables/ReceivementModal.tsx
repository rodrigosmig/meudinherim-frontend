import { memo } from "react";

import { ReceivementForm } from "../../Foms/receivable/ReceivementForm";
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

interface ReceivementModalProps {
  receivable: Receivable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const ReceivementModalComponent = ({ receivable, accounts, isOpen, onClose, refetch }: ReceivementModalProps) => {
  return (
    <Modal
      header="Recebimento de Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ReceivementForm
        receivable={receivable}
        accounts={accounts}
        onCancel={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}

export const ReceivementModal = memo(ReceivementModalComponent);