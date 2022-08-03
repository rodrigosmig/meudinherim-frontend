import { useState } from "react";
import Head from "next/head";
import {
  Checkbox,
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
  useDisclosure
} from "@chakra-ui/react";
import { Layout } from '../../components/Layout/index';
import { AddButton } from '../../components/Buttons/Add';
import { useAccounts } from "../../hooks/useAccounts";
import { EditButton } from '../../components/Buttons/Edit';
import { DeleteButton } from '../../components/Buttons/Delete';
import { Loading } from '../../components/Loading/index';
import { useMutation, useQueryClient } from 'react-query';
import { accountService } from "../../services/ApiService/AccountService";
import { ExtractButton } from '../../components/Buttons/Extract';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { Heading } from "../../components/Heading";
import { EditAccountModal } from "../../components/Modals/accounts/EditAccountModal";
import { CreateAccountModal } from "../../components/Modals/accounts/CreateAccountModal";
import { Table } from "../../components/Table";
import { getMessage } from "../../utils/helpers";
import { IAccount } from "../../types/account";

export default function Accounts() {
  const queryClient = useQueryClient();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const [active, setActive] = useState(true);

  const { data, isLoading, isFetching, isError } = useAccounts(active);

  const tableSize = isWideVersion ? 'md' : 'sm';

  const [ selectedAccount, setSelectedAccount ] = useState({} as IAccount)

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
      queryClient.invalidateQueries('accounts-form')
    }
  });

  const handleDeleteAccount = async (id: number) => {
    try {
      await deleteAccount.mutateAsync(id);

      getMessage("Sucesso", "Conta deletada com sucesso");

    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const headList = [
    'Nome',
    'Tipo'
  ];

  return (
    <>
      <CreateAccountModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />
      
      <EditAccountModal
        account={selectedAccount}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
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

        <Flex
          justify="space-between" 
          align="center"
          mb={[4, 4, 6]}
        >
          <Checkbox
              colorScheme={'pink'}
              isChecked={active}
              onChange={() => setActive(!active)}
            >
              Ativas
            </Checkbox>
        </Flex>

        { isLoading ? (
          <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as contas</Flex>
          ) : (
            <>
              <Table
                theadData={headList}
                size={tableSize}
              >
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