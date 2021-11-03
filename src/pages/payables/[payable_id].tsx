import { Box, Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';
import { Card } from "../../components/Card";
import { EditPayableForm } from "../../components/Foms/payable/EditPayableForm";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface Category {
  id: number,
  name: string,
}

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: Category;
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  parcelable_id: number,
}

type CategoriesForForm = {
    value: string;
    label: string;
  }

interface EditPayableProps {
    payable: Payable;
    categories: CategoriesForForm[];
}

export default function EditPayable({ payable, categories }: EditPayableProps) {
  return (
    <>
      <Head>
        <title>Editar Conta a Pagar | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                <Text>Editar Conta a Pagar</Text>
              </Heading>
            </Flex>

            <EditPayableForm payable={payable} categories={categories} />
          </>
        </Card>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {payable_id} = context.params;  
  const payableResponse = await apiClient.get(`/payables/${payable_id}`);
  
  const payable = payableResponse.data;

  const categoriesExpenseResponse = await apiClient.get(`/categories?type=2&per_page=1000`);

  const categories = categoriesExpenseResponse.data.data.map(category => {
    return {
      value: category.id,
      label: category.name
    }
  })

  return {
    props: {
      payable,
      categories
    }
  }
})