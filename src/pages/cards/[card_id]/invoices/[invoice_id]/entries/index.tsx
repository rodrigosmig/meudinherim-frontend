import { ChangeEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';
import {
  Button,
  Box,
  Flex,
  Icon,
  HStack,
  Spinner,
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Heading } from "../../../../../../components/Heading";
import { FilterPerPage } from "../../../../../../components/Pagination/FilterPerPage";
import { toCurrency } from "../../../../../../utils/helpers";
import { Layout } from "../../../../../../components/Layout";
import { withSSRAuth } from "../../../../../../utils/withSSRAuth";
import { setupApiClient } from "../../../../../../services/api";
import { BiCalendar } from "react-icons/bi";
import { useInvoiceEntries } from "../../../../../../hooks/useInvoiceEntries";
import { Pagination } from "../../../../../../components/Pagination";
import { Table } from "../../../../../../components/Table";
import { Loading } from "../../../../../../components/Loading";
import { EditButton } from "../../../../../../components/Buttons/Edit";
import { AddButton } from "../../../../../../components/Buttons/Add";
import { EditInvoiceEntryModal } from "../../../../../../components/Modals/invoice_entries/EditInvoiceEntryModal";
import { useMutation } from "react-query";
import { invoiceEntriesService } from "../../../../../../services/ApiService/InvoiceEntriesService";
import { DeleteButton } from "../../../../../../components/Buttons/Delete";
import { useInvoice } from "../../../../../../hooks/useInvoices";
import { CreateInvoiceEntryModal } from "../../../../../../components/Modals/invoice_entries/CreateInvoiceEntryModal";
import { BsClock } from "react-icons/bs"
import { PopoverTotal } from "../../../../../../components/PopoverTotal";
import { AnticipateInstallmentsModal } from "../../../../../../components/Modals/invoice_entries/AnticipateInstallmentsModal";

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

interface InvoiceEntriesProps {
  cardId: number;
  invoiceId: number;
}

export default function InvoiceEntries({ cardId, invoiceId }: InvoiceEntriesProps) {
  const { data: invoice, isLoading: isLoadingInvoice, refetch: refetchInvoice } = useInvoice(cardId, invoiceId);
  
  const toast = useToast();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();
  const { isOpen: anticipateModalIsOpen, onOpen: anticipateModalonOpen, onClose: anticipateModalOnClose } = useDisclosure();

  const [ page, setPage ] = useState(1);
  const [ perPage, setPerPage ] = useState(10);

  const [ dateRange, setDateRange ] = useState([null, null]);
  const [ selectedEntry, setSelectedEntry ] = useState({} as InvoiceEntry)

  const { data, isLoading, isFetching, isError, refetch } = useInvoiceEntries(cardId, invoiceId, page, perPage);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }

  const handleEditEntry = (id: number, parcelable_id: number | null) => {
    const entry = getSelectedEntry(id, parcelable_id);

    setSelectedEntry(entry);
    editModalonOpen();
  }

  const handleAnticipateInstallments = (id: number, parcelable_id: number | null) => {
    const entry = getSelectedEntry(id, parcelable_id);

    setSelectedEntry(entry);
    anticipateModalonOpen();
  }

  const getSelectedEntry = (id: number, parcelable_id: number | null) => {
    const entry = data.entries.filter(e => {
      return e.id === id && e.parcelable_id === parcelable_id
    })

    return entry[0];
  }

  const deleteEntry = useMutation(async (id: number) => {
    const response = await invoiceEntriesService.delete(id);
  
    return response.data;
  });

  const handleRefetchData = () => {
    refetch();
    refetchInvoice();
  }

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteEntry.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Lançamento deletado com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      handleRefetchData();
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
    <>
      <CreateInvoiceEntryModal
        card_id={cardId}
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={handleRefetchData}
      />

      <EditInvoiceEntryModal
        entry={selectedEntry}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={handleRefetchData}
      />

      <AnticipateInstallmentsModal
        entry={selectedEntry}
        isOpen={anticipateModalIsOpen} 
        onClose={anticipateModalOnClose}
        refetch={handleRefetchData}
      />

      <Head>
        <title>{ invoice?.card.name } | Meu Dinherim</title>
      </Head>
      
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
            <Icon as={BiCalendar} mb="5px" mr="4px" />
              { isLoadingInvoice ? (
                  <Spinner size="sm" color="gray.500" ml="4" />
                ) : (
                  invoice.due_date
                )
              }
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          
          <Heading>
            { isLoadingInvoice ? (
                <Spinner size="sm" color="gray.500" ml="4" />
              ) : (
                <Box color='red.600'>{ toCurrency(invoice.amount) }</Box>
              )
            }
          </Heading>
        </Flex>

        <Flex 
          justify="space-between" 
          align="center"
          mb={[6, 6, 8]}
        >
          <FilterPerPage onChange={handleChangePerPage} isWideVersion={isWideVersion} />

          <AddButton onClick={createModalOnOpen} />
        </Flex>

        { isLoading ? (
            <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as lançamentos</Flex>
          ) : (
            <>
            <Box overflowX="auto">
              <Table tableSize={sizeProps}>
                <Thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Categoria</Th>
                    <Th>Descrição</Th>
                    <Th>Valor</Th>
                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  { data.entries.map(entry => (
                    <Tr key={entry.id}>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{ entry.date }</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{entry.category.name}</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { entry.is_parcel ? (
                          <PopoverTotal
                            description={entry.description}
                            amount={entry.total_purchase}
                          />
                          ) : (
                            entry.description
                          )
                        }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <Text 
                        fontWeight="bold" 
                        color={entry.category.type == 1 ? "blue.500" : "red.500"}
                      >
                        { toCurrency(entry.value) }
                      </Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <HStack spacing={[2]}>
                          { (!entry.is_parcel && !entry.anticipated) && (
                            <>
                              <EditButton onClick={() => handleEditEntry(entry.id, entry.parcelable_id)} />
                              <DeleteButton
                                onDelete={() => handleDeleteEntry(entry.id)} 
                                resource="Lançamento"
                                loading={deleteEntry.isLoading}
                              />
                            </>
                          )}

                          {((entry.is_parcel || !entry.anticipated) && entry.parcel_number === 1) && (
                            <>
                              <DeleteButton
                                onDelete={() => handleDeleteEntry(entry.is_parcel ? entry.parcelable_id : entry.id)} 
                                resource="todas as parcelas"
                                loading={deleteEntry.isLoading}
                              />
                            </>
                          )}

                          {((entry.is_parcel || entry.anticipated) && entry.parcel_number < entry.parcel_total) && (
                            <>
                              <Button
                                size="sm"
                                fontSize="sm"
                                bg="green.500"
                                _hover={{ bg: "green.300" }}
                                _active={{
                                  bg: "green.400",
                                  transform: "scale(0.98)",
                                }}
                                leftIcon={<Icon as={BsClock} fontSize="16" />}
                                onClick={() => handleAnticipateInstallments(entry.id, entry.parcelable_id)} 
                              >
                                Antecipar
                              </Button>
                            </>
                          )}
                          
                        </HStack>
                      </Td>
                    </Tr>
                  )) }
                </Tbody>
              </Table>

            </Box>

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

        <Flex justify={["center", "left"]}>
          <Link href={`/cards/${cardId}/invoices`} passHref>
            <Button
              mt={8}
              size={sizeProps}
              variant="outline"
            >
              Voltar
            </Button>
          </Link>          
        </Flex>
        
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {card_id, invoice_id} = context.params
  
  const response = await apiClient.get(`/cards/${card_id}/invoices/${invoice_id}`);

  return {
    props: {
      cardId: card_id,
      invoiceId: invoice_id
    }
  }
})