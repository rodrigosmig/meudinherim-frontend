import { Modal } from "../Modal";
import { GeneratePaymentForm } from "../../Foms/payable/GeneratePaymentForm";

interface Invoice {
  id: number;
  due_date: string;
  closing_date: string;
  amount: number;
  paid: boolean;
  isClosed: boolean;
  card: {
    id: number;
    name: string;
  }
}

interface GeneratePaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export const GeneratePaymentModal = ({ invoice, isOpen, onClose }: GeneratePaymentModalProps) => {

  return (
    <Modal
      header="Gerar Contas a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <GeneratePaymentForm 
        invoice={invoice}
        onCancel={onClose}
      />
    </Modal>
  )
}