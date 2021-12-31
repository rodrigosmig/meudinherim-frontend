import { TransferBetweenAccountsForm } from "../../Foms/accountEntry/TransferBetweenAccountsForm";
import { CreateCardForm } from "../../Foms/card/CreateCardForm";
import { Modal } from "../Modal";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferBetweenAccountsModal = ({ isOpen, onClose }: CreateCategoryModalProps) => {
return (
  <Modal
    header="Transferência entre contas"
    isOpen={isOpen}
    onClose={onClose}
  >
    <TransferBetweenAccountsForm
      onCancel={onClose}
    />
  </Modal>
)
}