import { TransferBetweenAccountsForm } from "../../Foms/accountEntry/TransferBetweenAccountsForm";
import { CreateCardForm } from "../../Foms/card/CreateCardForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferBetweenAccountsModal = ({ isOpen, onClose }: Props) => {
return (
  <Modal
    header="TransferĂȘncia entre contas"
    isOpen={isOpen}
    onClose={onClose}
  >
    <TransferBetweenAccountsForm
      onCancel={onClose}
    />
  </Modal>
)
}