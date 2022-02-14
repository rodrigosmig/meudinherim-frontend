import { memo } from "react";
import { IPayable } from "../../../types/payable";
import { PaymentForm } from "../../Foms/payable/PaymentForm";
import { Modal } from "../Modal";

interface Props {
  payable: IPayable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const PaymentModalComponent = ({ payable, accounts, isOpen, onClose, refetch }: Props) => {
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