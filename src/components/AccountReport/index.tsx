import { 
  Box,
  SimpleGrid,
} from "@chakra-ui/react"
import { useAccountsReport } from "../../hooks/useAccountsReport";
import { toCurrency } from "../../utils/helpers";
import { Loading } from "../Loading";
import { AccountReportHeader } from "./Header";
import { AccountReportTab } from "./Tab";

interface AccountReportProps {
  rangeDate: [string, string];
  status: 'all' | 'open' | 'paid';
}

export const AccountReport = ({rangeDate, status}: AccountReportProps) => {
  const { data, isLoading, isFetching } = useAccountsReport(rangeDate, status);

  const getBalanceColor = (value: number) => {
    return value >= 0 ? 'blue.500' : 'red.500'
  }
  if (isLoading || isFetching) {
    return <Loading />
  }
  return (
    <>
      { ( !Array.isArray(data)) && (
        <>
          <Box width={["full","50%"]}>
            <SimpleGrid 
              columns={2} 
              spacing={2} 
              fontSize={["sm", "xl"]} 
              fontWeight={"bold"}
            >
              <AccountReportHeader 
                title="Contas a Receber:"
                color="blue.500"
                content={toCurrency(data.receivables.total)}
              />

              <AccountReportHeader 
                title="Contas a Pagar:"
                color="red.500"
                content={toCurrency(data.payables.total)}
              />

              <AccountReportHeader 
                title="Saldo:"
                color={getBalanceColor(data.receivables.total - data.payables.total)}
                content={toCurrency(data.receivables.total - data.payables.total)}
              />
            </SimpleGrid>
          </Box>

          <Box mt={10}>
            <AccountReportTab 
              payables={data.payables.items}
              receivables={data.receivables.items}
            />
          </Box>
        </>
      ) }
    </>
  )
}