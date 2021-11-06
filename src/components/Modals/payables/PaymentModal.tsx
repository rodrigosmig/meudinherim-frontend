import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast
} from "@chakra-ui/react";
import { memo } from "react";
import { PaymentForm } from "../../Foms/payable/PaymentForm";

interface Payable {
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
interface PaymentModalProps {
  payable: Payable;
  accounts: {
    value: string;
    label: string
  }[];
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const PaymentModalComponent = ({ payable, accounts, isOpen, onClose, refetch }: PaymentModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Pagamento de Conta</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={4}>
          <PaymentForm 
            payable={payable} 
            accounts={accounts}
            onCancel={onClose} 
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const PaymentModal = memo(PaymentModalComponent);