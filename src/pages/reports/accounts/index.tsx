import { useState } from "react";
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
import { AccountReport } from "../../../components/AccountReport";

type AccountStatus = 'all' | 'open' | 'paid';

export default function AccountsReport() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterDate, setFilterDate] = useState<[string, string]>(['', '']);
  const [AccountStatus, setAccountStatus] = useState<AccountStatus>('open');

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const handleClickFilter = () => {    
    if (dateRange[0] && dateRange[1]) {
      setFilterDate([toUsDate(dateRange[0]), toUsDate(dateRange[1])])
    } else {
      setFilterDate(['', ''])
    }
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
            isWideVersion={isWideVersion}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
            onClick={handleClickFilter}
          />

          <Select
            value={AccountStatus}
            //size={sizeProps}
            variant="unstyled"
            maxW={[150]}
            onChange={event => setAccountStatus(event.target.value)}
          >
            <option value="all">Todas</option>
            <option value="open">Abertas</option>
            <option value="paid">Pagas</option>
          </Select>
        </Flex>
          
        <Box>
          <AccountReport rangeDate={filterDate} status={AccountStatus} />
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