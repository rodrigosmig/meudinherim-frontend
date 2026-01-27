import { CreateReceivableForm } from "../../Foms/receivable/CreateReceivableForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateReceivableModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      header="Nova Conta a Receber"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateReceivableForm 
        onClose={onClose}
      />
    </Modal>
  )
}