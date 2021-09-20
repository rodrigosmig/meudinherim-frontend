import { Box, Flex, Heading } from "@chakra-ui/react";
import Head from 'next/head';
import { Layout } from '../../../../components/Layout/index';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import { setupApiClient } from '../../../../services/api';
import { EditAccountEntryForm } from "../../../../components/Foms/accountEntry/EditAccountEntryForm";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

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

interface Account {
  id: number;
  name: string;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  balance: number;
}

interface AccountEntry {
  id: number;
  date: string;
  category: Category;
  description: string;
  value: number;
  account: Account;
}

interface EditAccountEntryProps {
  entry: AccountEntry;
  categories: CategoriesForForm;
}

export default function EditAccountEntry({ entry, categories }: EditAccountEntryProps) {
  return (
    <>
      <Head>
        <title>Editar Lançamento | Meu Dinherim</title>
      </Head>

      <Layout>
        <Box
          flex='1' 
          borderRadius={8} 
          bg="gray.800" 
          p="8"
        >
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
              Editar Lançamento
            </Heading>
          </Flex>

          <EditAccountEntryForm entry={entry} categories={categories} />
          
        </Box>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {entry_id} = context.params;  
  const accountResponse = await apiClient.get(`/account-entries/${entry_id}`);
  
  const entry = accountResponse.data;

  const categoriesResponse = await apiClient.get(`/categories?type=all`);

  const categories = categoriesResponse.data;

  return {
    props: {
      entry,
      categories
    }
  }
})