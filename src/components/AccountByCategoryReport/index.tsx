import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab,
  TabPanel,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDateFilter } from "../../contexts/DateFilterContext";
import { useAccountByCategoryReport } from "../../hooks/useAccountByCategoryReport";
import { AccountIdType } from "../../types/account";
import { ICategory } from "../../types/category";
import { Loading } from "../Loading";
import { TotalByCategoryModal } from "../Modals/reports/TotalByCategoryModal";
import { TableReport } from "../TableReport";

interface Category extends Omit<ICategory, "type"> {}

interface Props {
  accountId: number;
}

export const AccountByCategoryReport = ({ accountId }: Props) => {
  const { stringDateRange } = useDateFilter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [category, setCategory] = useState({} as Category);
  
  
  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'gray';

  const { data, isLoading, isFetching } = useAccountByCategoryReport(stringDateRange, accountId);
   

  const headList = ['Categoria', 'Quantidade', 'Total'];

  const handleSelectedCategory = useCallback((id: number, name: string) => {
    setCategory({id, name});
    onOpen();
  }, [onOpen])

  if (isLoading || isFetching ) {
    return <Loading />
  }

  return (
    <>
      <TotalByCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        category={category}
        reportType="account"
        accountId={accountId}
      />
      { !Array.isArray(data) && (
        <Tabs isFitted variant='enclosed'>
          <TabList mb='1em' >
            <Tab fontSize={['xs', 'md']}>Entrada</Tab>
            <Tab fontSize={['xs', 'md']}>Saída</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <TableReport
                reportType="account"
                data={data.incomes}
                headList={headList}
                variant='striped'
                colorScheme={colorScheme}
                openModal={handleSelectedCategory}
              />
            </TabPanel>

            <TabPanel>
              <TableReport
                reportType="account"
                data={data.expenses}
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