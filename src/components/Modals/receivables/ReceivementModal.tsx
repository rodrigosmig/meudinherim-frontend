import { memo } from "react";
import { IReceivable } from "../../../types/receivable";

import { ReceivementForm } from "../../Foms/receivable/ReceivementForm";
import { Modal } from "../Modal";

interface Props {
  receivable: IReceivable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const ReceivementModalComponent = ({ receivable, accounts, isOpen, onClose, refetch }: Props) => {
  return (
    <Modal
      header="Recebimento de Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ReceivementForm
        receivable={receivable}
        accounts={accounts}
        onCancel={onClose}
        refetch={refetch}
      />
    </Modal>
  )
}

export const ReceivementModal = memo(ReceivementModalComponent);