import { memo, useEffect, useState, useRef } from "react";
import {
    Button,
    AlertDialog, 
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay,
    Flex,
    useDisclosure,
  } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { payableService } from "../../../services/ApiService/PayableService";
import { queryClient } from "../../../services/queryClient";
import { Input } from "../../Inputs/Input";
import { Loading } from "../../Loading";
import { ACCOUNTS_ENTRIES, ACCOUNTS_REPORT, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, PAYABLES, toBrDate, toCurrency } from "../../../utils/helpers";
import { Modal } from "../Modal";
import { CancelButton } from "../../Buttons/Cancel";
import { SubmitButton } from "../../Buttons/Submit";
import { ICancelData } from "../../../types/accountScheduling";
  
interface Props {
  accountId: number;
  parcelableId?: number; 
  isOpenModal: boolean;
  onCloseModal: () => void;
}
  
const ShowPaymentModalComponent = ({ 
  accountId, 
  parcelableId = null, 
  isOpenModal, 
  onCloseModal,
}: Props) => {
  const queryClient = useQueryClient();

  const [payable, setPayable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payableResponse = await payableService.get(accountId, parcelableId);
  
        setPayable(payableResponse.data)
        setIsLoading(false);
      } catch (error) {
        onCloseModal()
      }
    }
    if (isOpenModal) {
      fetchData();
    }
  }, [accountId, parcelableId, isOpenModal, onCloseModal]);

  const handleOnClose = () => {
    setIsLoading(true)
    onCloseModal()
  }

  const cancelPayment = useMutation(async (values: ICancelData) => {
    const response = await payableService.cancelPayment(values.id, values.parcelable_id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('accountEntries')
    }
  });

  const handleCancelPayment = async () => {
    const values = {
      id: payable.id,
      parcelable_id: payable.parcelable_id
    }

    try {
      await cancelPayment.mutateAsync(values);

      getMessage("Sucesso", "Pagamento cancelado com sucesso");

      queryClient.invalidateQueries(PAYABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);

      handleOnClose();

    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  return (
    <Modal
      header="Pagamento"
      isOpen={isOpenModal}
      onClose={onCloseModal}
    >
      { isLoading ? (
        <Loading />
        ) : (
          <>
            <Input
              name="paid_date"
              type="text"
              label="Data do Pagamento"
              value={toBrDate(payable.paid_date)}
              isDisabled={true}
            />

            <Input
              name="due_date"
              type="text"
              label="Vencimento"
              value={toBrDate(payable.due_date)}
              isDisabled={true}
            />

            <Input
              name="category"
              type="text"
              label="Categoria"
              value={payable.category.name}
              isDisabled={true}
            />

            <Input
              name="description"
              type="text"
              label="Descrição"
              value={payable.description}
              isDisabled={true}
            />

            <Input
              name="value"
              type="text"
              label="Valor"
              value={toCurrency(payable.value)}
              isDisabled={true}
            />
          <Flex
            mt={[10]}
            justify="flex-end"
            align="center"
            mb={4}
          >

            <CancelButton
              label="Fechar"
              mr={4}
              onClick={handleOnClose}
            />

            <SubmitButton
              label="Cancelar Pagamento"
              size="md"
              onClick={onOpen}
            />
          </Flex>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Cancelar o Pagamento
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Tem certeza que deseja cancelar o pagamento?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      aria-label="Cancel"
                      ref={cancelRef} 
                      onClick={onClose} 
                      variant="outline"
                      mr={4}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      colorScheme="red"
                      onClick={handleCancelPayment}
                      isLoading={cancelPayment.isLoading}
                    >
                      Confirmar
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )
      }
    </Modal>
  )
}
  
export const ShowPaymentModal = memo(ShowPaymentModalComponent);