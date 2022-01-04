import { memo } from "react";
import { PaymentForm } from "../../Foms/payable/PaymentForm";
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
  invoice: null | {invoice_id:number, card_id: number};
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}
interface PaymentModalProps {
  payable: Payable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const PaymentModalComponent = ({ payable, accounts, isOpen, onClose, refetch }: PaymentModalProps) => {
  return (
    <Modal
      header="Pagamento de Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PaymentForm 
        payable={payable} 
        accounts={accounts}
        onCancel={onClose} 
        refetch={refetch}
      />
    </Modal>
  )
}

export const PaymentModal = memo(PaymentModalComponent);