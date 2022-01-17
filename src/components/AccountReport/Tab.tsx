import { TabProps } from "@chakra-ui/react";
import { 
  Tbody, 
  Td,
  Text,
  Th, 
  Thead, 
  Tr,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react"
import { toBrDate, toCurrency } from "../../utils/helpers";
import { Table } from "../Table";

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 2;
  };
  invoice: null | {invoice_id:number, card_id: number};
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
    type: 1;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

interface TabReportProps extends TabProps {
  payables: Payable[];
  receivables: Receivable[];
}

export const AccountReportTab = ({ payables, receivables }: TabReportProps) => {
  return (
    <>
      <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
            <Tab fontSize={['xs', 'md']}>Contas a Receber</Tab>
            <Tab fontSize={['xs', 'md']}>Contas a Pagar</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table tableSize={"md"}>
              <>
                <Thead>
                  <Tr >
                    <Th>Vencimento</Th>
                    <Th>Pagamento</Th>
                    <Th>Categoria</Th>
                    <Th>Descrição</Th>
                    <Th>Valor</Th>
                  </Tr>
                </Thead>

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
              </>
            </Table>
          </TabPanel>

          <TabPanel>
            <Table tableSize={"md"}>
              <>
                <Thead>
                  <Tr >
                    <Th>Vencimento</Th>
                    <Th>Pagamento</Th>
                    <Th>Categoria</Th>
                    <Th>Descrição</Th>
                    <Th>Valor</Th>
                  </Tr>
                </Thead>

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
              </>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}