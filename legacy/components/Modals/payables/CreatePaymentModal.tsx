import { CreatePayableForm } from "../../Foms/payable/CreatePayableForm";
import { Modal } from "../Modal";
  
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePaymentModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      header="Nova Conta a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreatePayableForm
        onClose={onClose}
      />
    </Modal>
  )
}