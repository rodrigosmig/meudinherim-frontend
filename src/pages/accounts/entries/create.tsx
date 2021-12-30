import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';
import { Layout } from '../../../components/Layout/index';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { setupApiClient } from '../../../services/api';
import { CreateAccountEntryForm } from "../../../components/Foms/accountEntry/CreateAccountEntryForm";
import { Heading } from "../../../components/Heading";
import { useRouter } from "next/router";

type CategoriesForForm = {
  income: {
    id: number;
    label: string
  }[]
  expense: {
    id: number;
    label: string
  }[]
}

interface AccountForm {
  value: string;
  label: string;
}


export default function CreateAccountEntry() {
  const router = useRouter();

  const handleOnCancel = () => {
    router.push('/accounts');
  }

  return (
    <>
      <Head>
        <title>Adicionar Lançamento | Meu Dinherim</title>
      </Head>

      <Layout>
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading>
              <Text>Novo Lançamento | Conta</Text>
            </Heading>
          </Flex>

          <CreateAccountEntryForm 
            onCancel={handleOnCancel}
          />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
    const apiClient = setupApiClient(context);

    await apiClient.get(`/accounts`);

    return {
      props: {}
    }
})
