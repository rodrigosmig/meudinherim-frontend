import { IReceivable } from "../../../types/receivable";
import { EditReceivableForm } from "../../Foms/receivable/EditReceivableForm";
import { Modal } from "../Modal";

interface Props {
  receivable: IReceivable;
  isOpen: boolean;
  onClose: () => void;
}

export const EditReceivableModal = ({ receivable, isOpen, onClose }: Props) => {
  return (
    <Modal
      header="Editar Conta a Receber"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditReceivableForm 
        receivable={receivable}
        onClose={onClose}
      />
    </Modal>
  )
}