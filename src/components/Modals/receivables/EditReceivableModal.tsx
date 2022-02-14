import { IReceivable } from "../../../types/receivable";
import { EditReceivableForm } from "../../Foms/receivable/EditReceivableForm";
import { Modal } from "../Modal";

interface Props {
  receivable: IReceivable;
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditReceivableModal = ({ receivable, categories, isOpen, onClose, refetch }: Props) => {
  return (
    <Modal
      header="Editar Conta a Receber"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditReceivableForm 
        receivable={receivable}
        categories={categories}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}