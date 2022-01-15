import { 
  Box,
  SimpleGrid,
} from "@chakra-ui/react"
import { useDateFilter } from "../../contexts/DateFilterContext";
import { useAccountsReport } from "../../hooks/useAccountsReport";
import { toCurrency } from "../../utils/helpers";
import { Loading } from "../Loading";
import { AccountReportHeader } from "./Header";
import { AccountReportTab } from "./Tab";

interface AccountReportProps {
  status: 'all' | 'open' | 'paid';
}

export const AccountReport = ({ status }: AccountReportProps) => {
  const { stringDateRange } = useDateFilter();
  const { data, isLoading, isFetching } = useAccountsReport(stringDateRange, status);

  const getBalanceColor = (value: number) => {
    return value >= 0 ? 'blue.500' : 'red.500'
  }

  const getBalance = () => {
    return data?.receivables.total - (data?.payables.total + data?.invoices.total)
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
                title="Faturas Abertas:"
                color="red.500"
                content={toCurrency(data?.invoices.total)}
              />

              <AccountReportHeader 
                title="Saldo:"
                color={getBalanceColor(getBalance())}
                content={toCurrency(getBalance())}
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