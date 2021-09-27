import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';
import { Layout } from '../../../components/Layout/index';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { setupApiClient } from '../../../services/api';
import { CreateAccountEntryForm } from "../../../components/Foms/accountEntry/CreateAccountEntryForm";
import { Card } from "../../../components/Card";
import { Heading } from "../../../components/Heading";

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

interface CreateAccountEntryProps {
  categories: CategoriesForForm;
  formAccounts: AccountForm[]
}

export default function CreateAccountEntry({ categories, formAccounts }: CreateAccountEntryProps) {
  return (
    <>
      <Head>
        <title>Adicionar Lançamento | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                <Text>Nova Categoria</Text>
              </Heading>
            </Flex>

            <CreateAccountEntryForm 
              categories={categories} 
              formAccounts={formAccounts} 
            />
          </>
        </Card>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
    const apiClient = setupApiClient(context);

    const categoriesResponse = await apiClient.get(`/categories?type=all`);
    const categories = categoriesResponse.data

    const accountsResponse = await apiClient.get(`/accounts`);
    const formAccounts = accountsResponse.data.data.map(account => {
      return {
        value: account.id,
        label: account.name
      }
    })

    return {
      props: {
        categories,
        formAccounts
      }
    }
})
