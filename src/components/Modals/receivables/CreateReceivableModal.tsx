import { CreateReceivableForm } from "../../Foms/receivable/CreateReceivableForm";
import { Modal } from "../Modal";

interface CreateReceivableModalProps {
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateReceivableModal = ({ categories, isOpen, onClose, refetch }: CreateReceivableModalProps) => {
  return (
    <Modal
      header="Nova Conta a Receber"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateReceivableForm 
        categories={categories} 
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}