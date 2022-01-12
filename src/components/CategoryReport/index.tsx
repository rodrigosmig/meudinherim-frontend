import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab,
  TabPanel,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { useDateFilter } from "../../contexts/DateFilterContext";
import { useByCategoryReport } from "../../hooks/useByCategoryReport";
import { Loading } from "../Loading";
import { TotalByCategoryModal } from "../Modals/reports/TotalByCategoryModal";
import { TabTable } from "./TabTable";

type Category = {
  id: number,
  name: string
}

type ReportType = 'card' | 'account';

export const CategoryReport = () => {
  const { stringDateRange } = useDateFilter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [category, setCategory] = useState({} as Category);
  const [reportType, setReportType] = useState<ReportType>()
  
  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'gray';

  const { data, isLoading, isFetching } = useByCategoryReport(stringDateRange);  

  const headList = ['Categoria', 'Quantidade', 'Total'];

  const handleSelectedCategory = (id: number, name: string, type: ReportType) => {
    setCategory({id, name});
    setReportType(type)
    onOpen();
  }

  if (isLoading || isFetching) {
    return <Loading />
  }

  return (
    <>
      <TotalByCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        category={category}
        reportType={reportType}
      />
      { !Array.isArray(data) && (
        <Tabs isFitted variant='enclosed'>
          <TabList mb='1em' >
              <Tab fontSize={'xs'}>Entrada</Tab>
              <Tab fontSize={'xs'}>Saída</Tab>
              <Tab fontSize={'xs'}>Cartão de Crédito</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <TabTable
                reportType="account"
                data={data.incomes}
                headList={headList}
                variant='striped'
                colorScheme={colorScheme}
                openModal={handleSelectedCategory}
              />
            </TabPanel>

            <TabPanel>
              <TabTable
                reportType="account"
                data={data.expenses}
                headList={headList}
                variant='striped'
                colorScheme={colorScheme}
                openModal={handleSelectedCategory}
              />
            </TabPanel>

            <TabPanel>
              <TabTable
                reportType="card"
                data={data.creditCard}
                headList={headList}
                variant='striped'
                colorScheme={colorScheme}
                openModal={handleSelectedCategory}
              />
            </TabPanel>

          </TabPanels>
        </Tabs>
      ) }
    </>
  )
}