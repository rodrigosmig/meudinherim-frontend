import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';

import { useRouter } from "next/router";
import { CreatePayableForm } from "../../components/Foms/payable/CreatePayableForm";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface Props {
  categories: {
    value: string;
    label: string
  }[];
}

export default function CreatePayable({ categories }: Props) {
  const router = useRouter();

  const handleOnCancel = () => {
    router.push('/payables');
  }

  return (
    <>
      <Head>
        <title>Adicionar Conta a Pagar | Meu Dinherim</title>
      </Head>

      <Layout>
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading>
              <Text>Nova Conta a Pagar</Text>
            </Heading>
          </Flex>

          <CreatePayableForm 
            categories={categories}
            onCancel={handleOnCancel}
          />
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

    return {
      props: {
        categories
      }
    }
})
