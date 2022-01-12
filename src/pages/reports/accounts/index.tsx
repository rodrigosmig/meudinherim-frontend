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
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupApiClient } from "../../../services/api";
import { AccountReport } from "../../../components/AccountReport";
import { useDateFilter } from "../../../contexts/DateFilterContext";

type AccountStatus = 'all' | 'open' | 'paid';

export default function AccountsReport() {
  const { stringDateRange, startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();
  const [AccountStatus, setAccountStatus] = useState<AccountStatus>('open');

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleChangeStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AccountStatus
    setAccountStatus(value)
  }

  return (
    <>
      <Head>
        <title>Relatório de Contas | Meu Dinherim</title>
      </Head>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Relatório de Contas
            </>
          </Heading>
        </Flex>

        <Flex align="center" justifyContent={"space-between"}>
          <DateFilter
            label="Selecione um período"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
            onClick={handleDateFilter}
          />

          <Select
            value={AccountStatus}
            size={sizeProps}
            variant="unstyled"
            maxW={[150]}
            onChange={handleChangeStatus}
          >
            <option value="all">Todas</option>
            <option value="open">Abertas</option>
            <option value="paid">Pagas</option>
          </Select>
        </Flex>
          
        <Box>
          <AccountReport status={AccountStatus} />
        </Box>
        
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/auth/me');

  return {
    props: {}
  }
})