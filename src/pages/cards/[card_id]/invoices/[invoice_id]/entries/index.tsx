import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
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
  useDisclosure
} from "@chakra-ui/react";
import { Heading } from "../../../../../../components/Heading";
import { FilterPerPage } from "../../../../../../components/Pagination/FilterPerPage";
import { getMessage, toBrDate, toCurrency } from "../../../../../../utils/helpers";
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
import { GeneratePayment } from "../../../../../../components/Buttons/GeneratePayment";
import { GeneratePaymentModal } from "../../../../../../components/Modals/invoices/GeneratePaymentModal";
import { IInvoiceEntry } from "../../../../../../types/invoiceEntry";
import { Input } from "../../../../../../components/Inputs/Input";
import { InvoiceEntryItemsTable } from "../../../../../../components/ItemsTable/InvoiceEntryItemsTable";

interface Props {
  cardId: number;
  invoiceId: number;
}

export default function InvoiceEntries({ cardId, invoiceId }: Props) {
  const { data: invoice, isLoading: isLoadingInvoice, refetch: refetchInvoice } = useInvoice(cardId, invoiceId);

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();
  const { isOpen: anticipateModalIsOpen, onOpen: anticipateModalonOpen, onClose: anticipateModalOnClose } = useDisclosure();
  const { isOpen: generatePaymentIsOpen, onOpen: generatePaymentonOpen, onClose: generatePaymentOnClose } = useDisclosure();

  const [ page, setPage ] = useState(1);
  const [ perPage, setPerPage ] = useState(10);

  const [ selectedEntry, setSelectedEntry ] = useState({} as IInvoiceEntry)

  const { data, isLoading, isFetching, isError, refetch } = useInvoiceEntries(cardId, invoiceId, page, perPage);

  const [filteredEntries, setFilteredEntries] = useState([] as IInvoiceEntry[]);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  useEffect(() => {
    if (data) {
      setFilteredEntries(oldValue => data.entries);
    }
  }, [data]);

  const handleChangePerPage = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }, []);

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
    const entry = filteredEntries.filter(e => {
      return e.id === id && e.parcelable_id === parcelable_id
    })

    return entry[0];
  }

  const deleteEntry = useMutation(async (id: IInvoiceEntry['id']) => {
    const response = await invoiceEntriesService.delete(id);
  
    return response.data;
  });

  const handleRefetchData = () => {
    refetch();
    refetchInvoice();
  }

  const handleCloseGeneratePayment = () => {
    refetchInvoice();
    generatePaymentOnClose();
  }

  const handleDeleteEntry = async (id: IInvoiceEntry['id']) => {
    try {
      await deleteEntry.mutateAsync(id);

      getMessage("Sucesso", "Lançamento deletado com sucesso");

      handleRefetchData();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const handleSearchEntry = (categoryName: string) => {
    if (categoryName.length === 0) {
      return setFilteredEntries(data.entries);
    }

    const filtered = data.entries.filter(entry => (
      entry.description.toLocaleLowerCase().includes(categoryName) 
      || entry.category.name.toLocaleLowerCase().includes(categoryName))
    );

    setFilteredEntries(oldValue => filtered)
  }

  const theadData = [
    "Data",
    "Categoria",
    "Descrição",
    "Valor"
  ];

  return (
    <>
      <GeneratePaymentModal
        invoice={invoice}
        isOpen={generatePaymentIsOpen}
        onClose={handleCloseGeneratePayment}
      />

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
            <Icon as={BiCalendar} mr="4px" />
              { isLoadingInvoice ? (
                  <Spinner size="sm" color="gray.500" ml="4" />
                ) : (
                  toBrDate(invoice.due_date)
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
              <Input
                bgColor="gray.900"
                mb={[4, 4, 6]}
                name="search"
                type="text"
                placeholder="Pesquisar lançamento"
                onChange={event => handleSearchEntry(event.target.value)}
              />

              <Table
                isEmpty={filteredEntries.length === 0}
                theadData={theadData}
                size={sizeProps}
              >
                <Tbody>
                  <InvoiceEntryItemsTable
                    data={filteredEntries}
                    isLoading={deleteEntry.isLoading}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                    onAnticipateInstallments={handleAnticipateInstallments}
                  />
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

        <Flex 
          justify={["center", "left"]}
          mt={8}
          
        >
          <NextLink href={`/cards/${cardId}/invoices`} passHref>
            <Button
              size={sizeProps}
              variant="outline"
            >
              Voltar
            </Button>
          </NextLink>

          { (!isLoadingInvoice && invoice.isClosed && !invoice.hasPayable) && (
            <Box mt={[1, 0]} ml={2}>
              <GeneratePayment onClick={generatePaymentonOpen} />
            </Box>
          )}          
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