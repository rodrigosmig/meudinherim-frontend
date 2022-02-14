import { CreateAccountForm } from "../../Foms/account/CreateAccountForm";
import { Modal } from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateAccountModal = ({ isOpen, onClose, refetch }: Props) => {
return (
  <Modal
    header="Nova Conta"
    isOpen={isOpen}
    onClose={onClose}
  >
    <CreateAccountForm
      closeModal={onClose}
      refetch={refetch}
    />
  </Modal>
)
}