import { CreateAccountEntryForm } from "../../Foms/accountEntry/CreateAccountEntryForm";
import { Modal } from "../Modal";

interface CreateCategoryModalProps {
  accountId?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountEntryModal = ({ accountId, isOpen, onClose }: CreateCategoryModalProps) => {
return (
  <Modal
      header="Novo Lançamento na Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CreateAccountEntryForm
        accountId={accountId}
        onClose={onClose}
      />
  </Modal>
)
}