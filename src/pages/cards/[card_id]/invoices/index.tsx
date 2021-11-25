import { Layout } from "../../../../components/Layout";
import { setupApiClient } from "../../../../services/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";
import {
  Box,
  Flex ,
  Spinner
} from "@chakra-ui/react";
import { Heading } from "../../../../components/Heading";
import { toCurrency } from "../../../../utils/helpers";

interface Card {
  id: number;
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

interface InvoicesProps {
  card: Card
}

export default function Invoices({ card }: InvoicesProps) {
  console.log(card)
  return (
    <>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              {card?.name}
              {/* { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />} */}
            </>
          </Heading>
          <Heading>
            <Box color='blue.500'>{ toCurrency(card.balance) }</Box>
          </Heading>
        </Flex>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {card_id} = context.params

  
  const response = await apiClient.get(`/cards/${card_id}`);
  
  const card = response.data
  console.log(666,card)
  return {
    props: {
      card
    }
  }
})