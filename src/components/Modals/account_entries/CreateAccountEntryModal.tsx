import { CreateAccountEntryForm } from "../../Foms/accountEntry/CreateAccountEntryForm";
import { Modal } from "../Modal";

interface CreateCategoryModalProps {
  accountId: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateAccountEntryModal = ({ accountId, isOpen, onClose, refetch }: CreateCategoryModalProps) => {
return (
  <Modal
      header="Nova Lançamento | Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateAccountEntryForm
        accountId={accountId}
        onCancel={onClose}
        refetch={refetch}
      />
  </Modal>
)
}