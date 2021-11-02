import { memo, useEffect, useState, useRef } from "react";
import {
    AlertDialog, 
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { payableService } from "../../services/ApiService/PayableService";
import { toBrDate, toCurrency } from "../../utils/helpers";
import { Input } from "../Inputs/Input";
import { Loading } from "../Loading";
import { queryClient } from "../../services/queryClient";
  
  interface PaymentModalProps {
    accountId: number;
    parcelableId?: number; 
    isOpenModal: boolean;
    onCloseModal: () => void;
    refetchEntries: () => void;
    refetchBalance: () => void;
  }

  interface CancelPayableData {
    id: number, 
    parcelable_id: null | number
  }
  
  const ShowPaymentModalComponent = ({ 
    accountId, 
    parcelableId = null, 
    isOpenModal, 
    onCloseModal,
    refetchEntries,
    refetchBalance
  }: PaymentModalProps) => {
    const toast = useToast();
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
  
          onCloseModal()
        }
      }
      if (isOpenModal) {
        fetchData();
      }
    }, [accountId, parcelableId, isOpenModal]);
  
    const handleOnClose = () => {
      setIsLoading(true)
      onCloseModal()
    }

    const cancelPayment = useMutation(async (values: CancelPayableData) => {
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
  
        toast({
          title: "Sucesso",
          description: "Pagamento cancelado com sucesso",
          position: "top-right",
          status: 'success',
          duration: 10000,
          isClosable: true,
        });

        refetchEntries();
        refetchBalance();
        handleOnClose();
  
      } catch (error) {
        const data = error.response.data
        
        toast({
          title: "Erro",
          description: data.message,
          position: "top-right",
          status: 'error',
          duration: 10000,
          isClosable: true,
        })
      }
    }
  
    return (
      <Modal isOpen={isOpenModal} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
        <ModalContent bgColor={"gray.800"}>
          <ModalHeader>Pagamento de Conta</ModalHeader>
          <ModalCloseButton onClick={handleOnClose} />
  
          <ModalBody mb={4}>
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

                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent bgColor="gray.800">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Cancelar o Pagamento
                        </AlertDialogHeader>

                        <AlertDialogBody bgColor="gray.800">
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
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleOnClose}>
              Fechar
            </Button>
            <Button colorScheme="pink" onClick={onOpen}>
              Cancelar Pagamento
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    )
  }
  
  export const ShowPaymentModal = memo(ShowPaymentModalComponent);