import { IPayable } from "../../../types/payable";
import { EditPayableForm } from "../../Foms/payable/EditPayableForm";
import { Modal } from "../Modal";

interface EditPayableModalProps {
  payable: IPayable;
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditPayableModal = ({ payable, categories, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Conta a Pagar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditPayableForm
        payable={payable}
        categories={categories}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>

  )
}