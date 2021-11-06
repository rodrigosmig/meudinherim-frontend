import { ChangeEvent, useState } from 'react';
import Head from "next/head";
import {
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
  useDisclosure,
  useToast 
} from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { usePayables } from "../../hooks/usePayables";
import { AddButton } from "../../components/Buttons/Add";
import { Loading } from "../../components/Loading";
import { EditButton } from "../../components/Buttons/Edit";
import { DeleteButton } from "../../components/Buttons/Delete";
import { Table } from "../../components/Table";
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";
import { PaymentButton } from "../../components/Buttons/Payment";
import { DateFilter } from "../../components/DateFilter";
import { FilterPerPage } from "../../components/Pagination/FilterPerPage";
import { toCurrency, toUsDate } from '../../utils/helpers';
import { Pagination } from '../../components/Pagination';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { PopoverTotal } from '../../components/PopoverTotal';
import { payableService } from '../../services/ApiService/PayableService';
import { queryClient } from '../../services/queryClient';
import { useMutation } from 'react-query';
import { CancelPaymentButton } from '../../components/Buttons/CancelPayment';
import { PaymentModal } from '../../components/Modals/payables/PaymentModal';
import { CreatePaymentModal } from '../../components/Modals/payables/CreatePaymentModal';
import { EditPayableModal } from '../../components/Modals/payables/EditPayableModal';

interface CancelPayableData {
  id: number, 
  parcelable_id: null | number
}

interface AccountPayableProps {
  categories: {
    value: string;
    label: string
  }[];
  accounts: {
    value: string;
    label: string
  }[];
}

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 2
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

export default function AccountPayables({ categories, accounts }: AccountPayableProps) {
  const toast = useToast();

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
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterDate, setFilterDate] = useState<[string, string]>(['', '']);

  const [payableId, setPayableId] = useState(null);
  const [parcelableId, setParcelableId ] = useState(null);

  const [ selectedPayable, setSelectedPayable ] = useState({} as Payable)

  const { data, isLoading, isFetching, isError, refetch } = usePayables(filterDate, page, perPage, payableStatus);

  const tableSize = isWideVersion ? 'md' : 'sm';
  const sizeProps = isWideVersion ? 'md' : 'sm';

  const deletePayable = useMutation(async (id: number) => {
  const response = await payableService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('payables')
    }
  });

  const handleDeletePayable = async (id: number) => {
    try {
      await deletePayable.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Conta a pagar deletada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      refetch();
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
    const payable = data.payables.filter(r => {
      return r.id === id && r.parcelable_id === parcelable_id
    })
    console.log(payable)
    return payable[0];
  }

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }

  const handleClickFilter = () => {    
    if (dateRange[0] && dateRange[1]) {
      setFilterDate([toUsDate(dateRange[0]), toUsDate(dateRange[1])])
    } else {
      setFilterDate(['', ''])
    }
  }

  const handleChangePayableStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    setPayableStatus(event.target.value)
  }

  const cancelPayment = useMutation(async (values: CancelPayableData) => {
    const response = await payableService.cancelPayment(values.id, values.parcelable_id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('payables')
    }
  });

  const handleCancelPayment = async (id: number, parcelable_id: null | number) => {
    const values = {
      id,
      parcelable_id
    }

    try {
      await cancelPayment.mutateAsync(values);

      toast({
        title: "Sucesso",
        description: "Pagamento cancelado com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      refetch();
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
      <CreatePaymentModal
        categories={categories}
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={refetch}
      />

      <EditPayableModal
        payable={selectedPayable}
        categories={categories}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={refetch}
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
        <Card>
          <>
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
            isWideVersion={isWideVersion}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
            onClick={handleClickFilter}
          />
          
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
                onChange={event => handleChangePayableStatus(event)}
              >
                <option value="all">Todas</option>
                <option value="open" selected>Abertas</option>
                <option value="paid">Pagas</option>
              </Select>
            </Flex>          
          </Flex>
        
          { isLoading ? (
              <Loading />
            ) : isError ? (
              <Flex justify="center">Falha ao obter as contas</Flex>
            ) : (
              <>
                <Table tableSize={tableSize}>
                  <>
                    <Thead>
                      <Tr >
                        <Th>Vencimento</Th>
                        <Th>Pagamento</Th>
                        <Th>Categoria</Th>
                        <Th>Descrição</Th>
                        <Th>Valor</Th>
                        <Th w="8"></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data.payables.map(payable => (
                        <Tr key={ payable.id } px={[8]}>
                          <Td fontSize={["xs", "md"]}>
                            <Text fontWeight="bold">{payable.due_date}</Text>
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.paid_date}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.category.name}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.is_parcel ? (
                              <PopoverTotal
                                description={payable.description}
                                amount={payable.total_purchase}
                              />
                              ) : (
                                payable.description
                              )
                            }

                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { toCurrency(payable.value) }
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { !payable.paid ? (
                              <HStack spacing={[2]}>
                                <EditButton 
                                  isDisabled={payable.is_parcel}
                                  onClick={() => handlePayableForEdit(payable.id, payable.parcelable_id)}
                                />

                                <DeleteButton
                                  isDisabled={payable.is_parcel && payable.parcel_number !== 1}
                                  onDelete={() => handleDeletePayable(payable.is_parcel ? payable.parcelable_id : payable.id)} 
                                  resource="Conta a Pagar"
                                  loading={deletePayable.isLoading}
                                  isParcel={payable.is_parcel}
                                />

                                <PaymentButton onClick={() => handlePayment(payable.id, payable.parcelable_id)} />
                              </HStack>
                            ) : (
                              <CancelPaymentButton 
                                label="Cancelar Pagamento"
                                loading={cancelPayment.isLoading}
                                onCancel={() => handleCancelPayment(payable.id, payable.parcelable_id)} 
                              />
                            )}
                            
                          </Td>
                        </Tr>
                      )) }
                    </Tbody>
                  </>
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
          </>
        </Card>
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