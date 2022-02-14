import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';
import { CreateInvoiceEntryForm } from "../../../../components/Foms/InvoiceEntry/CreateInvoiceEntryForm";
import { Heading } from "../../../../components/Heading";
import { Layout } from "../../../../components/Layout";
import { setupApiClient } from "../../../../services/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";
import { useRouter } from 'next/router';

export default function CreateInvoiceEntry() {
  const router = useRouter();

  const handleOnCancel = () => {
    router.push('/cards');
  }

  return (
    <>
      <Head>
        <title>Adicionar Lançamento | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <Text>Novo Lançamento | Cartão de Crédito</Text>
          </Heading>
        </Flex>

        <CreateInvoiceEntryForm
          onCancel={handleOnCancel}
        />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const cardsResponse = await apiClient.get(`/cards`);

  return {
    props: {}
  }
})
