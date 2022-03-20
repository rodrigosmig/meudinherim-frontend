import { useEffect, useState } from "react";
import {
  Th, 
  Thead, 
  Tr,
  Tbody,
  Td,
  Text,
  Flex,
  useColorMode
} from "@chakra-ui/react";
import { useDateFilter } from "../../../contexts/DateFilterContext";
import { reportService } from "../../../services/ApiService/ReportService";
import { getMessage, toBrDate, toCurrency } from "../../../utils/helpers";
import { Loading } from "../../Loading";
import { Modal } from "../Modal";
import { Table } from "../../Table";
import { CancelButton } from "../../Buttons/Cancel";
import { ReportType } from "../../../types/report";

interface Props {
  reportType: ReportType;
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: number;
    name: string
  };
  accountId?: number;
}

interface Entries {
  id: number;
  date: string;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
  },
  source: string;
}[]

export const TotalByCategoryModal = ({ isOpen, onClose, category, reportType, accountId }: Props) => {
  const { stringDateRange } = useDateFilter();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<Entries[]>();
  const { colorMode } = useColorMode();

  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'gray';

  const selectedAccountId = accountId ? accountId : 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const receivableResponse = await reportService.getTotalByCategoryDetailed(stringDateRange, category.id, reportType, selectedAccountId);
        const newEntries = receivableResponse.data.data;

        setEntries(newEntries)
        setIsLoading(false);
      } catch (error) {
        getMessage('Erro', error.response.data.message, 'error')
        onClose()
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, category, onClose, reportType, stringDateRange]);

  const handleOnClose = () => {
    setIsLoading(true)
    onClose()
  }

  return (
    <Modal
      size="4xl"
      header={`Categoria: ${category.name}`}
      isOpen={isOpen}
      onClose={handleOnClose}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <Table tableSize={"md"} variant={"striped"} colorScheme={colorScheme}>
          <Thead>
            <Tr>
              <Th>Data</Th>
              <Th>Descrição</Th>
              <Th>Valor</Th>
              <Th>{ reportType === 'account' ? 'Conta' : 'Cartão' }</Th>
            </Tr>
          </Thead>

          <Tbody>
            { entries.map(entry => (
              <Tr key={entry.id}>
                <Td fontSize={["xs", "md"]}>
                  <Text>{ toBrDate(entry.date) }</Text>
                </Td>
                <Td fontSize={["xs", "md"]}>
                  <Text>{ entry.description }</Text>
                </Td>            
                <Td fontSize={["xs", "md"]}>
                  <Text>{ toCurrency(entry.value) }</Text>
                </Td>
                <Td fontSize={["xs", "md"]}>
                  <Text fontWeight={"bold"}>{ entry.source }</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Flex justifyContent={"right"}>
        <CancelButton
          label="Fechar"
          mt={6}
          onClick={handleOnClose}
        />
      </Flex>
      
    </Modal>
  )
}