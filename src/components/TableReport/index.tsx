import {
  Badge,
  TableProps, Tbody,
  Td,
  Text, Tr
} from "@chakra-ui/react";
import { memo } from "react";
import { ReportType, TotalByCategoryResponse } from "../../types/report";
import { toCurrency } from "../../utils/helpers";
import { Table } from "../Table";

interface Props extends TableProps {
  reportType: ReportType;
  headList: string[];
  data: TotalByCategoryResponse[],
  openModal: (id: number, name: string, reportType: ReportType) => void;
}

const TableReportComponent = ({ data, headList, openModal, reportType, ...rest }: Props) => {

  const isEmpty = () => {
    return data.length === 0;
  }

  return (
    <Table
      theadData={headList}
      isEmpty={isEmpty()}
      size={"md"} 
      {...rest}
    >
      <Tbody>
        { !isEmpty() && data.map(category => (
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

export const TableReport = memo(TableReportComponent);
