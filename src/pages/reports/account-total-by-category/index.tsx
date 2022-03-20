import Head from "next/head";
import { 
  Flex,
  Box,
} from "@chakra-ui/react"
import { Heading } from "../../../components/Heading"
import { Layout } from "../../../components/Layout"
import { DateFilter } from "../../../components/DateFilter";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupApiClient } from "../../../services/api";
import { useDateFilter } from "../../../contexts/DateFilterContext";
import { AccountByCategoryReport } from "../../../components/AccountByCategoryReport";
import { Select } from "../../../components/Inputs/Select";
import { ChangeEvent, useCallback, useState } from "react";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { Loading } from "../../../components/Loading";


export default function AccountTotalByCategoryReport() {
  const { startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();
  const [accountId, setAccountId] = useState(0);

  const { data: accounts, isLoading: isLoadingAccounts, isFetching: isFetchingAccounts } = useAccountsForm(true); 

  const handleChangeAccount = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    setAccountId(Number(id))
  }, [])

  return (
    <>
      <Head>
        <title>Relatório de Contas por Categoria | Meu Dinherim</title>
      </Head>
      <Layout>
        <Box mb={[6, 6, 8]}>
          <Heading>
            <>
            Total de Gastos nas Contas por Categoria
            </>
          </Heading>
        </Box>

        <Flex
          direction={["column" , "row", "row"]}
          justify={['space-between']}
          align={['center', 'flex-start', 'flex-start']}
          mb={[6, 0]}
        >
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
            { (isLoadingAccounts || isFetchingAccounts) 
              ? (
                  <Loading />
                )
              : (
                <Select
                  name="account_id"
                  options={accounts}
                  variant="unstyled"
                  maxW={[200]}
                  onChange={handleChangeAccount}
                />
              )
            }
          </Box>          
        </Flex>
            
        <Box>
          <AccountByCategoryReport accountId={accountId} />
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