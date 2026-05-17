import { memo } from "react";
import { IReceivable } from "../../../types/receivable";

import { ReceivementForm } from "../../Foms/receivable/ReceivementForm";
import { Modal } from "../Modal";

interface Props {
  receivable: IReceivable;
  isOpen: boolean;
  onClose: () => void;
}

const ReceivementModalComponent = ({ receivable, isOpen, onClose }: Props) => {
  return (
    <Modal
      header="Recebimento de Conta"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ReceivementForm
        receivable={receivable}
        onClose={onClose}
      />
    </Modal>
  )
}

export const ReceivementModal = memo(ReceivementModalComponent);