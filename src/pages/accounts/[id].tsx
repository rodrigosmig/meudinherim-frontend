
import { Box, Flex, Heading } from "@chakra-ui/react";
import Head from 'next/head';
import { EditAccountForm } from "../../components/Foms/account/EditAccountForm";
import { Layout } from '../../components/Layout/index';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';

type AccountType = {
  id: 'money' | 'savings' | 'checking_account' | 'investment';
}

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface EditAccountProps {
  account: Account;
}

export default function EditAccount({ account }: EditAccountProps) {
  return (
    <>
      <Head>
        <title>Editar categoria | Meu Dinherim</title>
      </Head>

      <Layout>
        <Box
          h={380}
          flex='1' 
          borderRadius={8} 
          bg="gray.800" 
          p="8"

        >
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
              Editar Conta
            </Heading>
          </Flex>

          <EditAccountForm account={account} />
          
        </Box>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {id} = context.params
  
  const response = await apiClient.get(`/accounts/${id}`);

  const account = response.data

  return {
    props: {
      account
    }
  }
})