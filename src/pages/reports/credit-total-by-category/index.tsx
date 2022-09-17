import Head from "next/head";
import { 
  Flex,
  Box,
  Text,
} from "@chakra-ui/react"
import { Heading } from "../../../components/Heading"
import { Layout } from "../../../components/Layout"
import { DateFilter } from "../../../components/DateFilter";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupApiClient } from "../../../services/api";
import { useDateFilter } from "../../../contexts/DateFilterContext";
import { CreditByCategoryReport } from "../../../components/CreditByCategoryReport";


export default function CreditTotalByCategoryReport() {
  const { startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();

  return (
    <>
      <Head>
        <title>Lançamentos em cartão por categoria | Meu Dinherim</title>
      </Head>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <Text>Relatório de lançamentos em cartão por categoria</Text>
          </Heading>
        </Flex>

        <DateFilter
            label="Selecione um período"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
            onClick={handleDateFilter}
          />
          
        <Box>
          <CreditByCategoryReport />
        </Box>
        
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  await apiClient.get('/auth/me');

  return {
    props: {}
  }
})