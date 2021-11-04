import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditReceivableForm } from "../../Foms/receivable/EditReceivableForm";

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

interface EditReceivableModalProps {
  receivable: Receivable;
  categories: {
    value: string;
    label: string
  }[],
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditReceivableModal = ({ receivable, categories, isOpen, onClose, refetch }: EditReceivableModalProps) => {
  console.log(receivable, 666)
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Editar Conta a Receber</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <EditReceivableForm 
            receivable={receivable}
            categories={categories}
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}