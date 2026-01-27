import { IAccount } from "../../../types/account";
import { EditAccountForm } from "../../Foms/account/EditAccountForm";
import { Modal } from "../Modal";

interface Props {
  account: IAccount;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAccountModal = ({ account, isOpen, onClose }: Props) => {
  return (
    <Modal
      header="Editar Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditAccountForm
        account={account}
        onClose={onClose}
      />
    </Modal>
  )
}