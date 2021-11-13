import { memo, useEffect, useState, useRef } from "react";
import {
    AlertDialog, 
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Button,
    Flex,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { queryClient } from "../../../services/queryClient";
import { Loading } from "../../Loading";
import { Input } from "../../Inputs/Input";
import { toBrDate, toCurrency } from "../../../utils/helpers";
import { Modal } from "../Modal";
import { CancelButton } from "../../Buttons/Cancel";
import { SubmitButton } from "../../Buttons/Submit";

  
  interface ShowReceivementModalProps {
    receivableId: number;
    parcelableId?: number; 
    isOpenModal: boolean;
    onCloseModal: () => void;
    refetchEntries: () => void;
    refetchBalance: () => void;
  }

  interface CancelReceivableData {
    id: number, 
    parcelable_id: null | number
  }
  
  const ShowReceivementModalComponent = ({ 
    receivableId, 
    parcelableId = null, 
    isOpenModal, 
    onCloseModal,
    refetchEntries,
    refetchBalance
  }: ShowReceivementModalProps) => {
    const toast = useToast();
    const [receivable, setReceivable] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const receivableResponse = await receivableService.get(receivableId, parcelableId);
    
          setReceivable(receivableResponse.data)
          setIsLoading(false);
        } catch (error) {
          onCloseModal()
        }
      }
      if (isOpenModal) {
        fetchData();
      }
    }, [receivableId, parcelableId, isOpenModal, onCloseModal]);
  
    const handleOnClose = () => {
      setIsLoading(true)
      onCloseModal()
    }

    const cancelReceivement = useMutation(async (values: CancelReceivableData) => {
      const response = await receivableService.cancelReceivement(values.id, values.parcelable_id);
    
      return response.data;
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries('accountEntries')
      }
    });
  
    const handleCancelReceivement = async () => {
      const values = {
        id: receivable.id,
        parcelable_id: receivable.parcelable_id
      }

      try {
        await cancelReceivement.mutateAsync(values);
  
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
      <Modal
        header="Recebimento"
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
                value={toBrDate(receivable.paid_date)}
                isDisabled={true}
              />

              <Input
                name="due_date"
                type="text"
                label="Vencimento"
                value={toBrDate(receivable.due_date)}
                isDisabled={true}
              />

              <Input
                name="category"
                type="text"
                label="Categoria"
                value={receivable.category.name}
                isDisabled={true}
              />

              <Input
                name="description"
                type="text"
                label="Descrição"
                value={receivable.description}
                isDisabled={true}
              />

              <Input
                name="value"
                type="text"
                label="Valor"
                value={toCurrency(receivable.value)}
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
                label="Cancelar Recebimento"
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
                        bg="red.500"
                        _hover={{ bg: "red.400" }}
                        _active={{
                          bg: "red.300",
                          transform: "scale(0.98)",
                        }}
                        onClick={handleCancelReceivement}
                        isLoading={cancelReceivement.isLoading}
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
  
  export const ShowReceivementModal = memo(ShowReceivementModalComponent);