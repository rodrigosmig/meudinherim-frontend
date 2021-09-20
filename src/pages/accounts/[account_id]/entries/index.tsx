import { ChangeEvent, useState } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { 
  Box,
  Flex, 
  Heading, 
  HStack, 
  Spinner, 
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
  useToast, 
} from "@chakra-ui/react";
import { Layout } from '../../../../components/Layout/index';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import { setupApiClient } from '../../../../services/api';
import { toUsDate } from '../../../../utils/helpers';
import { useAccountEntries } from '../../../../hooks/useAccountEntries';
import { useAccountBalance } from '../../../../hooks/useAccountBalance';
import { FilterPerPage } from '../../../../components/Pagination/FilterPerPage';
import { Loading } from '../../../../components/Loading/index';
import { EditButton } from '../../../../components/Buttons/Edit';
import { DeleteButton } from '../../../../components/Buttons/Delete';
import { Pagination } from '../../../../components/Pagination';
import { useMutation } from 'react-query';
import { accountEntriesService } from '../../../../services/ApiService/AccountEntriesService';
import { queryClient } from '../../../../services/queryClient';

import { DateFilter } from '../../../../components/DateFilter';

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface AccountEntriesProps {
  account: Account
}

export default function AccountEntries({ account }: AccountEntriesProps) {
  const toast = useToast();
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterDate, setFilterDate] = useState<[string, string]>(['', '']);

  const { data, isLoading, isFetching, isError, refetch } = useAccountEntries(account.id, filterDate, page, perPage);
  const { data: dataBalance, isLoading: isLoadingBalance, refetch: refetchBalance } = useAccountBalance(account.id);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  const deleteEntry = useMutation(async (id: number) => {
    const response = await accountEntriesService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('accountEntries')
    }
  });

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

      refetch();
      refetchBalance();
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

  return (
    <>
      <Head>
        <title>{ account.name } | Meu Dinherim</title>
      </Head>

      <Layout>
        <Box
          w={"full"}
          flex='1' 
          borderRadius={8} 
          bg="gray.800" p="8" 
          h="max-content"
        >
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['md', '2xl']} fontWeight="normal">
              {account.name}
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </Heading>
            <Heading fontSize={['md', '2xl']} fontWeight="normal">
              { isLoadingBalance ? (
                <Spinner size="sm" color="gray.500" ml="4" />
              ) : (
                <Box color={dataBalance?.balances[0].positive ? 'blue.500' : 'red.500'}>{ dataBalance?.balances[0].balance }</Box>
              )}
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
          </Flex>

          { isLoading ? (
              <Loading />
            ) : isError ? (
              <Flex justify="center">Falha ao obter as lançamentos</Flex>
            ) : (
              <>
              <Box overflowX="auto">
                <Table size={sizeProps} colorScheme="whiteAlpha">
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
                          <Text fontWeight="bold">{entry.description}</Text>
                        </Td>
                        <Td fontSize={["xs", "md"]}>
                          <Text 
                          fontWeight="bold" 
                          color={entry.category.type == 1 ? "blue.500" : "red.500"}
                        >
                          { entry.value }
                        </Text>
                        </Td>
                        <Td fontSize={["xs", "md"]}>
                          <HStack spacing={[2]}>
                            <EditButton href={`/accounts/${account.id}/entries/${entry.id}`} />
                            <DeleteButton 
                              onDelete={() => handleDeleteEntry(entry.id)} 
                              resource="Lançamento"
                              loading={deleteEntry.isLoading}
                            />
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
            )}
        </Box>      
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