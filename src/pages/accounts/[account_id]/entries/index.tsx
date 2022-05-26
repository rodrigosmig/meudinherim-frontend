import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Head from "next/head";
import { 
  Box,
  Flex, 
  Spinner, 
  Tbody, 
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { Layout } from '../../../../components/Layout/index';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import { setupApiClient } from '../../../../services/api';
import { getMessage } from '../../../../utils/helpers';
import { useAccountEntries } from '../../../../hooks/useAccountEntries';
import { useAccountBalance } from '../../../../hooks/useAccountBalance';
import { FilterPerPage } from '../../../../components/Pagination/FilterPerPage';
import { Loading } from '../../../../components/Loading/index';
import { Pagination } from '../../../../components/Pagination';
import { useMutation } from 'react-query';
import { accountEntriesService } from '../../../../services/ApiService/AccountEntriesService';
import { queryClient } from '../../../../services/queryClient';
import { DateFilter } from '../../../../components/DateFilter';
import { Heading } from '../../../../components/Heading';
import { ShowReceivementModal } from '../../../../components/Modals/receivables/ShowReceivementModal';
import { ShowPaymentModal } from '../../../../components/Modals/payables/ShowPaymentModal';
import { EditAccountEntryModal } from '../../../../components/Modals/account_entries/EditAccountEntryModal';
import { AddButton } from '../../../../components/Buttons/Add';
import { CreateAccountEntryModal } from '../../../../components/Modals/account_entries/CreateAccountEntryModal';
import { useDateFilter } from '../../../../contexts/DateFilterContext';
import { IAccount } from '../../../../types/account';
import { IAccountEntry } from '../../../../types/accountEntry';
import { Input } from '../../../../components/Inputs/Input';
import { Table } from '../../../../components/Table';
import { AccountEntryItemsTable } from '../../../../components/ItemsTable/AccountEntryItemsTable';

interface Props {
  account: IAccount
}

export default function AccountEntries({ account }: Props) {  
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: showPaymentIsOpen , onOpen: showPaymentOnOpen, onClose: showPaymentOnClose } = useDisclosure();
  const { isOpen: showReceivementIsOpen , onOpen: showReceivementOnOpen, onClose: showReceivementOnClose } = useDisclosure();
  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { stringDateRange, startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();

  const [payableId, setPayableId] = useState(null);
  const [parcelableId, setParcelableId ] = useState(null);
  const [receivableId, setReceivableId] = useState(null);
  const [ selectedEntry, setSelectedEntry ] = useState({} as IAccountEntry)

  const { data, isLoading, isFetching, isError, refetch } = useAccountEntries(account.id, stringDateRange, page, perPage);
  const { data: dataBalance, isLoading: isLoadingBalance, refetch: refetchBalance } = useAccountBalance(account.id);

  const [filteredEntries, setFilteredEntries] = useState([] as IAccountEntry[]);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  useEffect(() => {
    if (data) {
      setFilteredEntries(oldValue => data.entries);
    }
  }, [data]);

  const deleteEntry = useMutation(async (id: number) => {
    const response = await accountEntriesService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('accountEntries')
    }
  });

  const handleRefetchData = () => {
    refetch();
    refetchBalance();
  }

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteEntry.mutateAsync(id);

      getMessage("Sucesso", "Lançamento deletado com sucesso");

      refetch();
      refetchBalance();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const handleChangePerPage = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }, []);
  
  const handleShowPayment = (id: number, parcelable_id: null | number) => {
    setParcelableId(parcelable_id);
    setPayableId(id);
    showPaymentOnOpen();
  }

  const handleShowReceivement = (id: number, parcelable_id: null | number) => {
    setParcelableId(parcelable_id);
    setReceivableId(id);
    showReceivementOnOpen();
  }

  const handleEditEntry = (entry_id: number) => {
    const entry = getSelectedAccount(entry_id);

    setSelectedEntry(entry);
    editModalonOpen();
  }

  const getSelectedAccount = (id: number) => {
    const account = filteredEntries.filter(e => {
      return e.id === id
    })

    return account[0];
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
      <CreateAccountEntryModal
        accountId={account.id}
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={handleRefetchData}
      />

      <EditAccountEntryModal
        entry={selectedEntry}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={handleRefetchData}
      />

      <ShowPaymentModal
        accountId={payableId}
        parcelableId={parcelableId}
        isOpenModal={showPaymentIsOpen}
        onCloseModal={showPaymentOnClose}
        refetchEntries={refetch}
        refetchBalance={refetchBalance}
      />

      <ShowReceivementModal 
        receivableId={receivableId}
        parcelableId={parcelableId}
        isOpenModal={showReceivementIsOpen}
        onCloseModal={showReceivementOnClose}
        refetchEntries={refetch}
        refetchBalance={refetchBalance}
      />
      <Head>
        <title>{ account.name } | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              {account.name}
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            { isLoadingBalance ? (
              <Spinner size="sm" color="gray.500" ml="4" />
            ) : (
              <Box color={dataBalance?.balances[0].positive ? 'blue.500' : 'red.500'}>{ dataBalance?.balances[0].balance }</Box>
            )}
          </Heading>
        </Flex>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onChange={(update: [Date | null, Date | null]) => {
            setDateRange(update);
          }}
          onClick={handleDateFilter}
        />
      
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
                  <AccountEntryItemsTable
                    data={filteredEntries}
                    isLoading={deleteEntry.isLoading}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                    showPayment={handleShowPayment}
                    showReceivement={handleShowReceivement}
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
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {account_id} = context.params

  
  const response = await apiClient.get(`/accounts/${account_id}`);
  
  const account = response.data
  
  return {
    props: {
      account
    }
  }
})