import Head from "next/head";
import {
  Flex, 
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
  useToast
} from "@chakra-ui/react";
import { Layout } from '../../components/Layout/index';
import { AddButton } from '../../components/Buttons/Add';
import { useAccounts } from "../../hooks/useAccounts";
import { useRouter } from 'next/router';
import { EditButton } from '../../components/Buttons/Edit';
import { DeleteButton } from '../../components/Buttons/Delete';
import { Loading } from '../../components/Loading/index';
import { useMutation } from 'react-query';
import { accountService } from "../../services/ApiService/AccountService";
import { queryClient } from '../../services/queryClient';
import { ExtractButton } from '../../components/Buttons/Extract';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";

export default function Accounts() {
  const toast = useToast();
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { data, isLoading, isFetching, isError, refetch } = useAccounts();

  const tableSize = isWideVersion ? 'md' : 'sm';

  const handleAddAccount = () => {
    router.push('/accounts/create');
  }

  const handleEditAccount = (account_id: number) => {
    router.push(`/accounts/${account_id}`)
  }

  const deleteAccount = useMutation(async (id: number) => {
    const response = await accountService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts')
    }
  });

  const handleDeleteAccount = async (id: number) => {
    try {
      await deleteAccount.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Conta deletada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

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
      <Head>
        <title>Contas | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                <>
                  Contas
                  { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                </>
              </Heading>
              <Heading>
                <AddButton onClick={handleAddAccount} />
              </Heading>
            </Flex>

            { isLoading ? (
                <Loading />
              ) : isError ? (
                <Flex justify="center">Falha ao obter as contas</Flex>
              ) : (
                <>
                  <Table size={tableSize} colorScheme="whiteAlpha">
                    <Thead>
                      <Tr >
                        <Th>Nome</Th>
                        <Th>Tipo</Th>
                        <Th w="8"></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data.map(account => (
                        <Tr key={account.id} px={[8]}>
                          <Td fontSize={["xs", "md"]}>
                            <Text fontWeight="bold">{account.name}</Text>
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            { account.type.desc }
                          </Td>
                          <Td fontSize={["xs", "md"]}>
                            <HStack spacing={[2]}>
                              <EditButton onClick={() => handleEditAccount(account.id)} />
                              <DeleteButton 
                                onDelete={() => handleDeleteAccount(account.id)} 
                                resource="Conta"
                                loading={deleteAccount?.isLoading}
                              />
                              <ExtractButton href={`/accounts/${account.id}/entries`} />
                            </HStack>
                          </Td>
                        </Tr>
                      )) }
                    </Tbody>
                  </Table>
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
  
  const response = await apiClient.get('/accounts');

  return {
    props: {}
  }
})