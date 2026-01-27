import { IPayable } from "../../../types/payable";
import { EditPayableForm } from "../../Foms/payable/EditPayableForm";
import { Modal } from "../Modal";

interface EditPayableModalProps {
  payable: IPayable;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPayableModal = ({ payable, isOpen, onClose }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Conta a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditPayableForm
        payable={payable}
        onClose={onClose}
      />
    </Modal>

  )
}