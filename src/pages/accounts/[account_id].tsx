import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';
import { EditAccountForm } from "../../components/Foms/account/EditAccountForm";
import { Layout } from '../../components/Layout/index';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { setupApiClient } from '../../services/api';
import { Card } from "../../components/Card";
import { Heading } from "../../components/Heading";

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
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                <Text>Editar Conta</Text>
              </Heading>
            </Flex>

            <EditAccountForm account={account} />
          </>
        </Card>
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