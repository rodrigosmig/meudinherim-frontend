import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useToast
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { accountService } from "../../services/ApiService/AccountService";
import { categoryService } from "../../services/ApiService/CategoryService";
import { payableService } from "../../services/ApiService/PayableService";
import { toBrDate } from "../../utils/helpers";
import { PaymentForm } from "../Foms/payable/PaymentForm";
import { Input } from "../Inputs/Input";
import { Select } from "../Inputs/Select";
import { Switch } from "../Inputs/Switch";
import { Loading } from "../Loading";

interface ModalPaymentProps {
  accountId: number;
  parcelableId?: number; 
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const ModalPaymentComponent = ({ accountId, parcelableId = null, isOpen, onClose, refetch }: ModalPaymentProps) => {
  const toast = useToast();
  const [payable, setPayable] = useState(null);
  const [categories, setCategories] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payableResponse = await payableService.get(accountId, parcelableId);
        const accountsResponse = await accountService.list()

        const formAccounts = accountsResponse.data.data.map(account => {
          return {
            value: account.id,
            label: account.name
          }
        })
  
        setPayable(payableResponse.data)
        setAccounts(formAccounts)
        setCategories(categories)
        setIsLoading(false);
      } catch (error) {
        const data = error.response.data;
        const message = data.message ?? "Requisição inválida";

        toast({
          title: "Erro",
          description: message,
          position: "top-right",
          status: 'error',
          duration: 10000,
          isClosable: true,
        });

        onClose()
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [accountId, isOpen]);

  const handleOnClose = () => {
    setIsLoading(true)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Pagamento de Conta</ModalHeader>
        <ModalCloseButton onClick={handleOnClose} />

        <ModalBody mb={4}>
          { isLoading ? (
            <Loading />
            ) : (
              <PaymentForm 
                payable={payable} 
                accounts={accounts}
                onCancel={handleOnClose} 
                refetch={refetch}
              />
            )
          
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const ModalPayment = memo(ModalPaymentComponent);