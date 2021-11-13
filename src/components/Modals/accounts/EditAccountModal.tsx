import { EditAccountForm } from "../../Foms/account/EditAccountForm";
import { Modal } from "../Modal";

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface EditPayableModalProps {
  account: Account;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditAccountModal = ({ account, isOpen, onClose, refetch }: EditPayableModalProps) => {
  return (
    <Modal
      header="Editar Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditAccountForm
        account={account}
        closeModal={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}