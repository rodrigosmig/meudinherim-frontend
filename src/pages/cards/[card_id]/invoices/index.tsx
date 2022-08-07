import { ChangeEvent, useState } from "react";
import Head from "next/head";
import { Layout } from "../../../../components/Layout";
import { setupApiClient } from "../../../../services/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";
import {
  Box,
  Flex,
  HStack,
  Select,
  Spinner,
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { Heading } from "../../../../components/Heading";
import { getMessage, toBrDate, toCurrency } from "../../../../utils/helpers";
import { FilterPerPage } from "../../../../components/Pagination/FilterPerPage";
import { useInvoices } from "../../../../hooks/useInvoices";
import { Loading } from "../../../../components/Loading";
import { Table } from "../../../../components/Table";
import { Pagination } from "../../../../components/Pagination";
import { ShowEntriesButton } from "../../../../components/Buttons/ShowEntries";
import { useRouter } from "next/router";
import { GeneratePayment } from "../../../../components/Buttons/GeneratePayment";
import { GeneratePaymentModal } from "../../../../components/Modals/invoices/GeneratePaymentModal";
import { ICard, IInvoice } from "../../../../types/card";
import { SetPaidButton } from "../../../../components/Buttons/SetPaid";
import { useMutation, useQueryClient } from "react-query";
import { cardService } from "../../../../services/ApiService/CardService";

interface Props {
  card: ICard
}

type StatusType = "open" | "paid";

export default function Invoices({ card }: Props) {
  const queryClient = useQueryClient();

  const router = useRouter()
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [invoiceStatus, setInvoiceStatus] = useState<StatusType>("open");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice>()

  const { data, isLoading, isFetching, isError } = useInvoices(card.id, invoiceStatus, page, perPage);

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }

  const handleChangeInvoiceStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setInvoiceStatus(event.target.value as StatusType)
  }

  const handleShowEntries = (cardId: number, invoiceId: number) => {
    router.push(`/cards/${cardId}/invoices/${invoiceId}/entries`)
  }

  const handleGeneratePayment = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  }

  const isEmpty = (invoice: IInvoice) => {
    return invoice.amount === 0;
  }

  const setPaid = useMutation(async (invoiceId: number) => {
    const response = await cardService.setInvoiceAsPaid(invoiceId);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('invoices')
      queryClient.invalidateQueries('invoice')
    }
  });

  const handleSetAsPaid = async (invoiceId: number) => {
    try {
      await setPaid.mutateAsync(invoiceId);

      getMessage("Sucesso", "Fatura marcada como paga com sucesso");
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const headList = [
    'Vencimento',
    'Data do Fechamento',
    'Valor da Fatura'
  ]

  return (
    <>
      <GeneratePaymentModal
        invoice={selectedInvoice}
        isOpen={isOpen}
        onClose={onClose}
      />

      <Head>
        <title>Faturas | { card.name }</title>
      </Head>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              {card?.name}
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            <Box color='blue.500'>Limite: { toCurrency(card.balance) }</Box>
          </Heading>
        </Flex>

        <Flex 
          justify="space-between" 
          align="center"
          mb={[6, 6, 8]}
        >
          <FilterPerPage onChange={handleChangePerPage} isWideVersion={isWideVersion} />

          <Flex align="center">
            <Select
              size={sizeProps}
              variant="unstyled"
              maxW={[150]}
              onChange={event => handleChangeInvoiceStatus(event)}
            >
              <option value="open">Abertas</option>
              <option value="paid">Pagas</option>
            </Select>
          </Flex>            
        </Flex>

        { isLoading ? (
            <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as faturas</Flex>
          ) : (
            <>
              <Table
                theadData={headList}
                size={sizeProps}
              >
                <Tbody>
                  { data.invoices.map(invoice => (
                    <Tr key={invoice.id}>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{ toBrDate(invoice.due_date) }</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{ invoice.closing_date }</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold" color={"red.600"}>{ toCurrency(invoice.amount) }</Text>
                      </Td>
                      <Td>
                        <HStack spacing={[2]}>                              
                          <ShowEntriesButton onClick={() => handleShowEntries(card.id, invoice.id)} />7
                          
                          { (!isEmpty(invoice) && invoice.isClosed && !invoice.hasPayable) && (
                            <GeneratePayment onClick={() => handleGeneratePayment(invoice)} />
                          )}

                          { (isEmpty(invoice) && invoice.isClosed && !invoice.hasPayable && !invoice.paid) && (
                            <SetPaidButton
                              onSetPaid={() => handleSetAsPaid(invoice.id)}
                              loading={setPaid.isLoading}
                            />
                          )}

                        </HStack>
                      </Td>
                    </Tr>
                  )) }
                </Tbody>
              </Table>

              <Pagination
                from={data.meta.from}
                to={data.meta.to}
                lastPage={data.meta.last_page}
                currentPage={page}
                totalRegisters={data.meta.total}
                onPageChange={setPage}
              />

            </>
          )
        }
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {card_id} = context.params

  
  const response = await apiClient.get(`/cards/${card_id}`);
  
  const card = response.data

  return {
    props: {
      card
    }
  }
})