import {
  Checkbox,
  Flex,
  Tbody, 
  Td, 
  Text, 
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { Table } from "../../Table";
import { Modal } from "../Modal";
import { Loading } from "../../Loading";
import { getMessage, toBrDate, toCurrency } from "../../../utils/helpers";
import { CancelButton } from "../../Buttons/Cancel";
import { AnticipateButton } from "../../Buttons/Anticipate";
import { IInvoiceEntry } from "../../../types/invoiceEntry";

interface Props {
  entry: IInvoiceEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const AnticipateInstallmentsModal = ({ entry, isOpen, onClose, refetch }: Props) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const tableSize = isWideVersion ? 'md' : 'sm';
  const modalSize = isWideVersion ? '4xl' : 'xs'

  const [installments, setInstallments] = useState<IInvoiceEntry[]>([]);
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
  }, [isOpen, onClose, entry.parcelable_id, entry.parcel_number]);

  const handleCheckAnticipate = (instalmment_id: number) => {
    installments.map(installment  => {
      if ( installment.id === instalmment_id) {
        installment.anticipated = !installment.anticipated;

        handleSelectedInstallments(installment);
      }
    })
  }

  const handleSelectedInstallments  = (installment: IInvoiceEntry) => {
    if (installment.anticipated) {
      selected_installments.push(installment.id);
    } else {
      const index = getInstallmentIndex(installment);

      if (index >= 0) {
        selected_installments.splice(index, 1);
      }
    }
  }

  const getInstallmentIndex = (installment: IInvoiceEntry) => {
    return selected_installments.indexOf(installment.id)
  }

  const handleAnticipateInstallments = async () => {
    if (selected_installments.length === 0) {
      getMessage("Error", "Selecione pelo menos uma parcela", 'error');
      
      return;
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

      getMessage("Sucesso", "Parcelas antecipadas com sucesso");
      
      setIsSubmitting(false);
      refetch();
      onClose();

    } catch (error) {
      const data = error.response.data;

      getMessage("Error", data.message, 'error');
    }

  }

  const theadData = [
    "Parcela",
    "Data",
    "Descrição",
    "Valor",
    "Antecipar"
  ]

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
          <Table 
            size={tableSize}
            theadData={theadData}
          >
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

          <AnticipateButton
            isLoading={isSubmitting}
            onClick={handleAnticipateInstallments}
          />
          </Flex>
        </>
      )}
    </Modal>
  )
}