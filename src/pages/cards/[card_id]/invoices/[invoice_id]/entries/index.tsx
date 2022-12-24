import {
  Box, Button, Flex,
  Icon,
  Spinner, Stack, Tbody,
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import { AddButton } from "../../../../../../components/Buttons/Add";
import { GeneratePayment } from "../../../../../../components/Buttons/GeneratePayment";
import { ParcialPayment } from "../../../../../../components/Buttons/PartialPayment";
import { Heading } from "../../../../../../components/Heading";
import { Input } from "../../../../../../components/Inputs/Input";
import { InvoiceEntryItemsTable } from "../../../../../../components/ItemsTable/InvoiceEntryItemsTable";
import { Layout } from "../../../../../../components/Layout";
import { Loading } from "../../../../../../components/Loading";
import { GeneratePaymentModal } from "../../../../../../components/Modals/invoices/GeneratePaymentModal";
import { PartialPaymentModal } from "../../../../../../components/Modals/invoices/PartialPaymentModal";
import { AnticipateInstallmentsModal } from "../../../../../../components/Modals/invoice_entries/AnticipateInstallmentsModal";
import { CreateInvoiceEntryModal } from "../../../../../../components/Modals/invoice_entries/CreateInvoiceEntryModal";
import { EditInvoiceEntryModal } from "../../../../../../components/Modals/invoice_entries/EditInvoiceEntryModal";
import { Pagination } from "../../../../../../components/Pagination";
import { FilterPerPage } from "../../../../../../components/Pagination/FilterPerPage";
import { Table } from "../../../../../../components/Table";
import { useInvoiceEntries } from "../../../../../../hooks/useInvoiceEntries";
import { useInvoice } from "../../../../../../hooks/useInvoices";
import { setupApiClient } from "../../../../../../services/api";
import { invoiceEntriesService } from "../../../../../../services/ApiService/InvoiceEntriesService";
import { IInvoiceEntry } from "../../../../../../types/invoiceEntry";
import { CARDS, getMessage, INVOICE, INVOICES, INVOICE_ENTRIES, OPEN_INVOICES, toBrDate, toCurrency } from "../../../../../../utils/helpers";
import { withSSRAuth } from "../../../../../../utils/withSSRAuth";

interface Props {
  cardId: number;
  invoiceId: number;
}

export default function InvoiceEntries({ cardId, invoiceId }: Props) {
  const queryClient = useQueryClient();

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
  const { isOpen: partialPaymentIsOpen, onOpen: partialPaymentonOpen, onClose: partialPaymentOnClose } = useDisclosure();

  const [ page, setPage ] = useState(1);
  const [ perPage, setPerPage ] = useState(10);

  const [ selectedEntry, setSelectedEntry ] = useState({} as IInvoiceEntry)

  const { data, isLoading, isFetching, isError } = useInvoiceEntries(cardId, invoiceId, page, perPage);

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

  const handleCloseGeneratePayment = () => {
    refetchInvoice();
    generatePaymentOnClose();
  }

  const handleDeleteEntry = async (id: IInvoiceEntry['id']) => {
    try {
      await deleteEntry.mutateAsync(id);

      getMessage("Sucesso", "Lançamento deletado com sucesso");

      queryClient.invalidateQueries(INVOICE);
      queryClient.invalidateQueries(INVOICES);
      queryClient.invalidateQueries(INVOICE_ENTRIES);
      queryClient.invalidateQueries(OPEN_INVOICES);
      queryClient.invalidateQueries(CARDS);

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

  const showPartialPaymentButton = () => {
    return invoice?.amount > 0 && !invoice?.isClosed
  }
  
  const showGeneratePaymentButton = () => {
    return invoice.isClosed && !invoice.hasPayable && !invoice.paid && invoice.amount > 0;
  }

  const theadData = [
    "Data",
    "Categoria",
    "Descrição",
    "Valor"
  ];

  return (
    <>
      <PartialPaymentModal
        cardId={cardId}
        isOpen={partialPaymentIsOpen}
        onClose={partialPaymentOnClose}
      />

      <GeneratePaymentModal
        invoice={invoice}
        isOpen={generatePaymentIsOpen}
        onClose={handleCloseGeneratePayment}
      />

      <CreateInvoiceEntryModal
        card_id={cardId}
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />

      <EditInvoiceEntryModal
        entry={selectedEntry}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
      />

      <AnticipateInstallmentsModal
        entry={selectedEntry}
        isOpen={anticipateModalIsOpen} 
        onClose={anticipateModalOnClose}
      />

      <Head>
        <title>{ invoice?.card.name } | Meu Dinherim</title>
      </Head>
      
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
            {isLoadingInvoice && <Spinner size="sm" color="gray.500" ml="4" />}

            {!isLoadingInvoice && (
              <Flex align="center">                
                <Box>
                  <Icon as={BiCalendar} fontSize={"28px"} mr={1}/>
                </Box>

                <Box>{toBrDate(invoice.due_date)}</Box>

                &nbsp; - &nbsp;<Text fontWeight={"extrabold"}>{invoice?.card.name}</Text>

                { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml={1} />}
              </Flex>
            )}
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
          
          <Flex>
            <Stack spacing={[2]} direction="row" >
              { showPartialPaymentButton() && (
                <ParcialPayment
                  label={"Pagar Parcial"}
                  onClick={partialPaymentonOpen} 
                />
              )}

              <AddButton onClick={createModalOnOpen} />
            </Stack>

          </Flex>
        </Flex>

        {isLoading && <Loading />}

        {isError && <Flex justify="center">Falha ao obter as lançamentos</Flex>}

        {!isLoading && !isError && (
          <>
            <Input
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
        )}

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

          { (!isLoadingInvoice && showGeneratePaymentButton()) && (
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
  
  await apiClient.get(`/cards/${card_id}/invoices/${invoice_id}`);

  return {
    props: {
      cardId: card_id,
      invoiceId: invoice_id
    }
  }
})