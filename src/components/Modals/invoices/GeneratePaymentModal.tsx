import { Modal } from "../Modal";
import { GeneratePaymentForm } from "../../Foms/payable/GeneratePaymentForm";
import { IInvoice } from "../../../types/card";

interface Props {
  invoice: IInvoice;
  isOpen: boolean;
  onClose: () => void;
}

export const GeneratePaymentModal = ({ invoice, isOpen, onClose }: Props) => {

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