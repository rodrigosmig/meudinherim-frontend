import { useState } from "react";
import Head from "next/head";
import {
  Flex, 
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
import { Layout } from '../../components/Layout/index';
import { AddButton } from '../../components/Buttons/Add';
import { useAccounts } from "../../hooks/useAccounts";
import { EditButton } from '../../components/Buttons/Edit';
import { DeleteButton } from '../../components/Buttons/Delete';
import { Loading } from '../../components/Loading/index';
import { useMutation } from 'react-query';
import { accountService } from "../../services/ApiService/AccountService";
import { queryClient } from '../../services/queryClient';
import { ExtractButton } from '../../components/Buttons/Extract';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { Heading } from "../../components/Heading";
import { EditAccountModal } from "../../components/Modals/accounts/EditAccountModal";
import { CreateAccountModal } from "../../components/Modals/accounts/CreateAccountModal";
import { Table } from "../../components/Table";

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

export default function Accounts() {
  const toast = useToast();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isError, refetch } = useAccounts();

  const tableSize = isWideVersion ? 'md' : 'sm';

  const [ selectedAccount, setSelectedAccount ] = useState({} as Account)

  const handleEditAccount = (account_id: number) => {
    const account = getSelectedAccount(account_id);
    setSelectedAccount(account);
    editModalonOpen();
  }

  const getSelectedAccount = (id: number) => {
    const account = data.filter(a => {
      return a.id === id
    })

    return account[0];
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
      <CreateAccountModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={refetch}
      />
      
      <EditAccountModal
        account={selectedAccount}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={refetch}
      />

      <Head>
        <title>Contas | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Contas
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            <AddButton onClick={createModalOnOpen} />
          </Heading>
        </Flex>

        { isLoading ? (
          <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as contas</Flex>
          ) : (
            <>
              <Table tableSize={tableSize}>
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
          )
        }
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