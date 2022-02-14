import { IAccount } from "../../../types/account";
import { EditAccountForm } from "../../Foms/account/EditAccountForm";
import { Modal } from "../Modal";

interface Props {
  account: IAccount;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditAccountModal = ({ account, isOpen, onClose, refetch }: Props) => {
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