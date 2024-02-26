import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Head from "next/head";

import {
  Flex, 
  Select,
  Spinner,
  Tbody, 
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { usePayables } from "../../hooks/usePayables";
import { AddButton } from "../../components/Buttons/Add";
import { Loading } from "../../components/Loading";
import { Table } from "../../components/Table";
import { Heading } from "../../components/Heading";
import { DateFilter } from "../../components/DateFilter";
import { FilterPerPage } from "../../components/Pagination/FilterPerPage";
import { ACCOUNTS_ENTRIES, ACCOUNTS_REPORT, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, PAYABLES } from '../../utils/helpers';
import { Pagination } from '../../components/Pagination';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { payableService } from '../../services/ApiService/PayableService';
import { useMutation, useQueryClient } from 'react-query';
import { PaymentModal } from '../../components/Modals/payables/PaymentModal';
import { CreatePaymentModal } from '../../components/Modals/payables/CreatePaymentModal';
import { EditPayableModal } from '../../components/Modals/payables/EditPayableModal';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { IPayable } from '../../types/payable';
import { ICancelData } from '../../types/accountScheduling';
import { PayableItemsTable } from '../../components/ItemsTable/PayableItemsTable';
import { Input } from '../../components/Inputs/Input';

interface Props {
  categories: {
    value: string;
    label: string
  }[];
  accounts: {
    value: string;
    label: string
  }[];
}

export default function AccountPayables({ accounts }: Props) {
  const queryClient = useQueryClient();

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();
  const { isOpen: paymentModalIsOpen, onOpen: paymentModalOnOpen, onClose: paymentModalOnClose } = useDisclosure();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [payableStatus, setPayableStatus] = useState("open");

  const { stringDateRange, startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();

  const [ selectedPayable, setSelectedPayable ] = useState({} as IPayable)

  const { data, isLoading, isFetching, isError, refetch } = usePayables(stringDateRange, page, perPage, payableStatus);

  const [filteredPayables, setFilteredPayables] = useState([] as IPayable[]);

  const sizeProps = isWideVersion ? 'md' : 'sm';
  useEffect(() => {
    if (data) {
      setFilteredPayables(oldValue => data.payables);
    }
  }, [data]);

  const deletePayable = useMutation(async (id: number) => {
  const response = await payableService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(PAYABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);
    }
  });

  const handleDeletePayable = async (id: number) => {
    try {
      await deletePayable.mutateAsync(id);

      getMessage("Sucesso", "Conta a pagar deletada com sucesso");

      refetch();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const handlePayment = (id: number, parcelable_id: null | number) => {
    const payable = getSelectedPayable(id, parcelable_id)
    
    setSelectedPayable(payable)
    paymentModalOnOpen();
  }

  const handlePayableForEdit = (id: number, parcelable_id: number | null) => {
    const payable = getSelectedPayable(id, parcelable_id)

    setSelectedPayable(payable)
    editModalonOpen()
  }

  const getSelectedPayable = (id: number, parcelable_id: number | null) => {
    const payable = filteredPayables.filter(r => {
      return r.id === id && r.parcelable_id === parcelable_id
    })

    return payable[0];
  }

  const handleChangePerPage = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }, []);

  const cancelPayment = useMutation(async (values: ICancelData) => {
    const response = await payableService.cancelPayment(values.id, values.parcelable_id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(PAYABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);
      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);
    }
  });

  const handleCancelPayment = async (id: number, parcelable_id: null | number) => {
    const values = {
      id,
      parcelable_id
    }

    try {
      await cancelPayment.mutateAsync(values);

      getMessage("Sucesso", "Pagamento cancelado com sucesso");

      refetch();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const handleSearchPayable = (categoryName: string) => {
    if (categoryName.length === 0) {
      return setFilteredPayables(data.payables);
    }

    const filtered = data.payables.filter(payable => (
      payable.description.toLocaleLowerCase().includes(categoryName) 
      || payable.category.name.toLocaleLowerCase().includes(categoryName))
    );

    setFilteredPayables(oldValue => filtered)
  }

  const theadData = [
    "Vencimento",
    "Categoria",
    "Descrição",
    "Mensal",
    "Valor"
  ];

  return (
    <>
      <CreatePaymentModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />

      <EditPayableModal
        payable={selectedPayable}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
      />

      <PaymentModal
        payable={selectedPayable}
        accounts={accounts}
        isOpen={paymentModalIsOpen} 
        onClose={paymentModalOnClose}
        refetch={refetch}
      />
      <Head>
        <title>Contas a Pagar | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Contas a Pagar { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            <AddButton onClick={createModalOnOpen} />
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

          <Flex align="center">
            <Select
              value={payableStatus}
              size={sizeProps}
              variant="unstyled"
              maxW={[150]}
              onChange={event => setPayableStatus(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="open">Abertas</option>
              <option value="paid">Pagas</option>
            </Select>
          </Flex>          
        </Flex>

        {isLoading && <Loading />}

        {isError && <Flex justify="center">Falha ao obter as contas</Flex>}
      
        { !isLoading && !isError && (
          <>
            <Input
              mb={[4, 4, 6]}
              name="search"
              type="text"
              placeholder="Pesquisar conta"
              onChange={event => handleSearchPayable(event.target.value)}
            />

            <Table
              isEmpty={filteredPayables.length === 0}
              theadData={theadData}
              size={sizeProps}
            >
              <Tbody>
                <PayableItemsTable 
                  data={filteredPayables}
                  isLoadingonDelete={deletePayable.isLoading}
                  isLoadingOnCancel={cancelPayment.isLoading}
                  onEdit={handlePayableForEdit}
                  onDelete={handleDeletePayable}
                  onPayment={handlePayment}
                  cancelPayment={handleCancelPayment}
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
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const categoriesExpenseResponse = await apiClient.get(`/categories?type=2&per_page=1000`);

  const categories = categoriesExpenseResponse.data.data.map(category => {
    return {
      value: category.id,
      label: category.name
    }
  });

  const accountsResponse = await apiClient.get(`/accounts`);

  const formAccounts = accountsResponse.data.data.map(account => {
    return {
      value: account.id,
      label: account.name
    }
  })

  return {
    props: {
      categories,
      accounts: formAccounts
    }
  }
})