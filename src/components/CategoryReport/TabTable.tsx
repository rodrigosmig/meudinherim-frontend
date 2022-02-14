import {
  Badge,
  TableProps,
  Th, 
  Thead, 
  Tr,
  Tbody,
  Td,
  Text
} from "@chakra-ui/react";
import { ReportType } from "../../types/report";
import { toCurrency } from "../../utils/helpers";
import { Table } from "../Table";

interface Props extends TableProps {
  reportType: ReportType;
  headList: string[];
  data: {
    category: string;
    id: number;
    total: number;
    quantity: number
  }[],
  openModal: (id: number, name: string, reportType: ReportType) => void;
}

export const TabTable = ({ data, headList, openModal, reportType, ...rest }: Props) => {
  return (
    <Table tableSize={"md"} {...rest}>
      <Thead>
        <Tr>
          { headList.map(head => (
            <Th key={head}>{ head }</Th>
          ))}
        </Tr>
      </Thead>

      <Tbody>
        { data.map(category => (
          <Tr key={category.id}>
            <Td fontSize={["xs", "md"]}>
              <Text>{ category.category }</Text>
            </Td>
            <Td fontSize={["xs", "md"]}>
              <Badge
                fontSize={"md"}
                colorScheme='green'
                variant='solid'
                cursor={"pointer"}
                onClick={() => openModal(category.id, category.category, reportType)}
              >
                { category.quantity }
              </Badge>
            </Td>
            <Td fontSize={["xs", "md"]}>
              <Text>{ toCurrency(category.total) }</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}