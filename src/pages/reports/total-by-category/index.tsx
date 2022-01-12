import { ChangeEvent, useState } from "react";
import Head from "next/head";
import { 
  Flex,
  useBreakpointValue,
  Box,
  Select
} from "@chakra-ui/react"
import { Heading } from "../../../components/Heading"
import { Layout } from "../../../components/Layout"
import { DateFilter } from "../../../components/DateFilter";
import { toUsDate } from "../../../utils/helpers";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupApiClient } from "../../../services/api";
import { CategoryReport } from "../../../components/CategoryReport";
import { useDateFilter } from "../../../contexts/DateFilterContext";


export default function TotalByCategoryReport() {
  const { startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  return (
    <>
      <Head>
        <title>Relatório Total por Categoria | Meu Dinherim</title>
      </Head>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Relatório Total por Categoria
            </>
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
          <CategoryReport />
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