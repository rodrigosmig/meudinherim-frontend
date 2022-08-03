import { CreateAccountForm } from "../../Foms/account/CreateAccountForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal = ({ isOpen, onClose }: Props) => {
return (
  <Modal
    header="Nova Conta"
    isOpen={isOpen}
    onClose={onClose}
  >
    <CreateAccountForm
      onClose={onClose}
    />
  </Modal>
)
}