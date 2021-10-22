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
  useToast 
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { usePayables } from "../../hooks/usePayables";
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

export default function AccountPayables() {
  const toast = useToast();
  const router = useRouter();

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

  const { data, isLoading, isFetching, isError } = usePayables(filterDate, page, perPage, payableStatus);

  const tableSize = isWideVersion ? 'md' : 'sm';
  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleAddAccount = () => {
    router.push('/payables/create');
  }

  const handleDeleteAccount = (id: number) => {
    console.log("delete")
  }

  const handlePayment = (id: number) => {
    console.log("payment")
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

  return (
    <>
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
              <AddButton onClick={handleAddAccount} />
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
                        <Th>Mensal</Th>
                        <Th>Pago</Th>
                        <Th w="8"></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data.payables.map(payable => (
                        <Tr key={payable.id} px={[8]}>
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
                            { payable.description}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.value}
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.monthly ? <Check /> : <Close /> }
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { payable.paid ? <Check /> : <Close /> }
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            <HStack spacing={[2]}>
                              
                              <EditButton 
                                isDisabled={payable.is_parcel}
                                href={`/payables/${payable.id}`}
                              />
                              <DeleteButton 
                                onDelete={() => handleDeleteAccount(payable.id)} 
                                resource="Conta"
                                loading={false}
                              />
                              <PaymentButton onClick={() => handlePayment(payable.id)} />
                            </HStack>
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

  const payablesResponse = await apiClient.get('/payables');

  return {
    props: {}
  }
})