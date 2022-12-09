import {
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  TabProps, 
  Tabs, 
  Tbody,
  Td,
  Text, 
  Tr
} from "@chakra-ui/react";
import { IPayable } from "../../types/payable";
import { IReceivable } from "../../types/receivable";
import { toBrDate, toCurrency } from "../../utils/helpers";
import { Table } from "../Table";

interface Props extends TabProps {
  payables: IPayable[];
  receivables: IReceivable[];
}

export const AccountReportTab = ({ payables, receivables }: Props) => {
  
  const headList = [
    "Vencimento",
    "Pagamento",
    "Categoria",
    "Descrição",
    "Valor"
  ];

  return (
    <>
      <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
            <Tab fontSize={['xs', 'md']}>Contas a Receber</Tab>
            <Tab fontSize={['xs', 'md']}>Contas a Pagar</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table
              isEmpty={receivables.length === 0}
              theadData={headList}
              size={"md"}
            >
              <Tbody>
                { receivables?.map(receivable => (
                  <Tr key={receivable.is_parcel ? receivable.parcelable_id : receivable.id}>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toBrDate(receivable.due_date) }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toBrDate(receivable.paid_date) }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ receivable.category.name }</Text>
                    </Td>

                    <Td fontSize={["xs", "md"]}>
                      <Text>{ receivable.description }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toCurrency(receivable.value) }</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Table
              isEmpty={payables.length === 0}
              theadData={headList}
              size={"md"}
            >
              <Tbody>
                { payables.map(payable => (
                  <Tr key={payable.is_parcel ? payable.parcelable_id : payable.id}>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toBrDate(payable.due_date) }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toBrDate(payable.paid_date) }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ payable.category.name }</Text>
                    </Td>

                    <Td fontSize={["xs", "md"]}>
                      <Text>{ payable.description }</Text>
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <Text>{ toCurrency(payable.value) }</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}