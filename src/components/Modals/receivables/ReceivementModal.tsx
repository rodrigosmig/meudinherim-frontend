import { memo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ReceivementForm } from "../../Foms/receivable/ReceivementForm";

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface ReceivementModalProps {
  receivable: Receivable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const ReceivementModalComponent = ({ receivable, accounts, isOpen, onClose, refetch }: ReceivementModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Recebimento de Conta</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={4}>
          <ReceivementForm
            receivable={receivable}
            accounts={accounts}
            onCancel={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const ReceivementModal = memo(ReceivementModalComponent);