import {
  Button,
  Checkbox,
  Flex,
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { Table } from "../../Table";
import { Modal } from "../Modal";
import { Loading } from "../../Loading";
import { toBrDate, toCurrency } from "../../../utils/helpers";
import { CancelButton } from "../../Buttons/Cancel";
import { AnticipateButtonButton } from "../../Buttons/Anticipate";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface InvoiceEntry {
  id: number;
  date: string;
  description: string;
  value: number;
  category: Category;
  card_id: number;
  invoice_id: number;
  is_parcel: boolean;
  parcel_number: number;
  parcel_total: number;
  total_purchase: number;
  parcelable_id: number;
  anticipated: boolean;
}

interface EditInvoiceEntryModalProps {
  entry: InvoiceEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const AnticipateInstallmentsModal = ({ entry, isOpen, onClose, refetch }: EditInvoiceEntryModalProps) => {
  const toast = useToast();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const tableSize = isWideVersion ? 'md' : 'sm';
  const modalSize = isWideVersion ? '4xl' : 'xs'

  const [installments, setInstallments] = useState<InvoiceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected_installments = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoiceEntriesService.getNextInstallments(entry.parcelable_id, entry.parcel_number);
        
        const installmentsResponse = response.data.data.map( installment => {
          return {
            ...installment,
            anticipated: false
          }
        });

        setInstallments(installmentsResponse);
        setIsLoading(false);
      } catch (error) {
        onClose();
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, onClose]);

  const handleCheckAnticipate = (instalmment_id: number) => {
    installments.map(installment  => {
      if ( installment.id === instalmment_id) {
        installment.anticipated = !installment.anticipated;

        handleSelectedInstallments(installment);
      }
    })
  }

  const handleSelectedInstallments  = (installment: InvoiceEntry) => {
    if (installment.anticipated) {
      selected_installments.push(installment.id);
    } else {
      const index = getInstallmentIndex(installment);

      if (index >= 0) {
        selected_installments.splice(index, 1);
      }
    }
  }

  const getInstallmentIndex = (installment: InvoiceEntry) => {
    return selected_installments.indexOf(installment.id)
  }

  const handleAnticipateInstallments = async () => {
    if (selected_installments.length === 0) {
      return setMessage(
        "Error",
        "Selecione pelo menos uma parcela",
        "error"
      )
    }

    setIsSubmitting(true);

    const data = {
      id: entry.parcelable_id,
      data: {
        parcels: selected_installments
      }
    }

    try {
      await invoiceEntriesService.anticipateInstallments(data);

      setMessage(
        "Sucesso",
        "Parcelas antecipadas com sucesso",
        "success"
      )
      
      setIsSubmitting(false);
      refetch();
      onClose();

    } catch (error) {
      const data = error.response.data
      
      setMessage(
        "Error",
        data.message,
        "error"
      )
    }

  }

  const setMessage = (
    title: string,
    description: string,
    status: "success" | "error" | "warning"
  ) => {
    toast({
      title: title,
      description: description,
      position: "top-right",
      status: status,
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Modal
      size={modalSize}
      header="Antecipar Parcelas"
      isOpen={isOpen}
      onClose={onClose}
    >
      { isLoading ? (
        <Loading />
      ) : installments.length === 0 
        ? (
          <Text>Nenhuma parcela para antecipar</Text>
        ) 
        : (
        <>
          <Table tableSize={tableSize}>
            <Thead>
              <Tr >
                <Th>Parcela</Th>
                <Th>Data</Th>
                <Th>Descrição</Th>
                <Th>Valor</Th>
                <Th>Antecipar</Th>
              </Tr>
            </Thead>

            <Tbody>
              { installments.map(installment => (
                <Tr key={installment.id} px={[8]}>
                  <Td fontSize={["xs", "md"]}>
                    <Text fontWeight="bold">{installment.parcel_number}</Text>
                  </Td>
                  <Td fontSize={["xs", "md"]}>
                    { toBrDate(installment.date) }
                  </Td>
                  <Td fontSize={["xs", "md"]}>
                    { installment.description }
                  </Td>
                  <Td fontSize={["xs", "md"]}>
                    { toCurrency(installment.value) }
                  </Td>
                  <Td fontSize={["xs", "md"]}>
                    <Checkbox onChange={() => handleCheckAnticipate(installment.id)} colorScheme="pink" align="center" />
                  </Td>
                </Tr>
              )) }
            </Tbody>
          </Table>

          <Flex
          mt={[10]}
          justify="flex-end"
          align="center"
          >
          <CancelButton
            mr={4}
            onClick={onClose}
          />

          <AnticipateButtonButton
            isLoading={isSubmitting}
            onClick={handleAnticipateInstallments}
          />
          </Flex>
        </>
      )}
    </Modal>
  )
}