import { ChangeEvent, useState } from "react";
import Head from "next/head";
import { Layout } from "../../../../components/Layout";
import { setupApiClient } from "../../../../services/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
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
import { toBrDate, toCurrency } from "../../../../utils/helpers";
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

interface Props {
  card: ICard
}

type StatusType = "open" | "paid";

export default function Invoices({ card }: Props) {
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
              <Table tableSize={sizeProps}>
                <Thead>
                  <Tr>
                    <Th>Vencimento</Th>
                    <Th>Data do Fechamento</Th>
                    <Th>Valor da Fatura</Th>
                    <Th w="8"></Th>
                  </Tr>
                </Thead>

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
                          
                          { (invoice.isClosed && !invoice.hasPayable) && (
                            <GeneratePayment onClick={() => handleGeneratePayment(invoice)} />
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