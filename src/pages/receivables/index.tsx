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
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { AddButton } from "../../components/Buttons/Add";
import { Loading } from "../../components/Loading";
import { EditButton } from "../../components/Buttons/Edit";
import { DeleteButton } from "../../components/Buttons/Delete";
import { Check } from "../../components/Icons/Check";
import { Close } from "../../components/Icons/Close";
import { Table } from "../../components/Table";
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";
import { PaymentButton } from "../../components/Buttons/Payment";
import { DateFilter } from "../../components/DateFilter";
import { FilterPerPage } from "../../components/Pagination/FilterPerPage";
import { toUsDate } from '../../utils/helpers';
import { Pagination } from '../../components/Pagination';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { PopoverTotal } from '../../components/PopoverTotal';
import { queryClient } from '../../services/queryClient';
import { useMutation } from 'react-query';
import { CancelPaymentButton } from '../../components/Buttons/CancelPayment';
import { PaymentModal } from '../../components/Modals/PaymentModal';
import { receivableService } from '../../services/ApiService/ReceivableService';
import { useReceivables } from '../../hooks/useReceivable';
import { CreateReceivableModal } from '../../components/Modals/receivables/CreateReceivableModal';

interface CancelReceivableData {
  id: number, 
  parcelable_id: null | number
}

interface AccountReceivableProps {
  categories: {
    value: string;
    label: string
  }[]
}

export default function AccountReceivable({ categories }: AccountReceivableProps) {
  const toast = useToast();
  const router = useRouter();

  const { isOpen: createModalIsOpen, onOpen: createModalonOpen, onClose: createModalOnClose } = useDisclosure()

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [receivableStatus, setPayableStatus] = useState("open");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterDate, setFilterDate] = useState<[string, string]>(['', '']);
  /* const { isOpen, onOpen, onClose } = useDisclosure() */
  const [receivableId, setPayableId] = useState(null);
  const [parcelableId, setParcelableId ] = useState(null);

  const { data, isLoading, isFetching, isError, refetch: refetchReceivable } = useReceivables(filterDate, page, perPage, receivableStatus);

  const tableSize = isWideVersion ? 'md' : 'sm';
  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleAddAccount = () => {
    router.push('/receivables/create');
  }

  const deletePayable = useMutation(async (id: number) => {
    const response = await receivableService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('receivables')
    }
  });

  const handleDeletePayable = async (id: number) => {
    try {
      await deletePayable.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Conta a receber deletada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      refetchReceivable();
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

  /* const handlePayment = (id: number, parcelable_id: null | number) => {
    setParcelableId(parcelable_id);
    setPayableId(id);
    onOpen();
  } */

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

  const cancelPayment = useMutation(async (values: CancelReceivableData) => {
    const response = await receivableService.cancelReceivement(values.id, values.parcelable_id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('receivables')
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
      {/* <PaymentModal 
        accountId={receivableId}
        parcelableId={parcelableId}
        isOpen={isOpen} 
        onClose={onClose}
        refetch={refetch}
      /> */}
      <CreateReceivableModal
        categories={categories}
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={refetchReceivable}
      />
      <Head>
        <title>Contas a Receber | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading>
              <>
                Contas a Receber { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
              </>
            </Heading>
            <Heading>
              <AddButton onClick={createModalonOpen} />
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
                      { data.receivables.map(receivable => (
                        <Tr key={ receivable.id } px={[8]}>
                          <Td fontSize={["xs", "md"]}>
                            <Text fontWeight="bold">{receivable.due_date}</Text>
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { receivable.paid_date}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { receivable.category.name}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { receivable.is_parcel ? (
                              <PopoverTotal
                                description={receivable.description}
                                amount={receivable.total_purchase}
                              />
                              ) : (
                                receivable.description
                              )
                            }

                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { receivable.value}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { !receivable.paid ? (
                              <HStack spacing={[2]}>
                                <EditButton 
                                  isDisabled={receivable.is_parcel}
                                  href={`/receivables/${receivable.id}`}
                                />

                                <DeleteButton
                                  isDisabled={receivable.is_parcel && receivable.parcel_number !== 1}
                                  onDelete={() => handleDeletePayable(receivable.is_parcel ? receivable.parcelable_id : receivable.id)} 
                                  resource="Conta a Receber"
                                  loading={deletePayable.isLoading}
                                  isParcel={receivable.is_parcel}
                                />

                                {/* <PaymentButton onClick={() => handlePayment(receivable.id, receivable.parcelable_id)} /> */}
                              </HStack>
                            ) : (
                              <CancelPaymentButton 
                                label="Cancelar Pagamento"
                                loading={cancelPayment.isLoading}
                                onCancel={() => handleCancelPayment(receivable.id, receivable.parcelable_id)} 
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

  const categoriesExpenseResponse = await apiClient.get(`/categories?type=1&per_page=1000`);
    const categories = categoriesExpenseResponse.data.data.map(category => {
      return {
        value: category.id,
        label: category.name
      }
    })

  return {
    props: {
      categories
    }
  }
})