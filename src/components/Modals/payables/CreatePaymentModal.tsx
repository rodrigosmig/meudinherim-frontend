import { CreatePayableForm } from "../../Foms/payable/CreatePayableForm";
import { Modal } from "../Modal";

  
interface Props {
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreatePaymentModal = ({ categories, isOpen, onClose, refetch }: Props) => {
  return (
    <Modal
      header="Nova Conta a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreatePayableForm
        categories={categories} 
        onCancel={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}