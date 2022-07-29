import { useColorMode, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useDateFilter } from "../../contexts/DateFilterContext";
import { useCreditByCategoryReport } from "../../hooks/useCreditByCategoryReport";
import { ICategory } from "../../types/category";
import { Loading } from "../Loading";
import { TotalByCategoryModal } from "../Modals/reports/TotalByCategoryModal";
import { TableReport } from "../TableReport";

interface Category extends Omit<ICategory, "type" | "active"> {}

export const CreditByCategoryReport = () => {
  const { stringDateRange } = useDateFilter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [category, setCategory] = useState({} as Category);
  
  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'gray';

  const { data, isLoading, isFetching } = useCreditByCategoryReport(stringDateRange);  

  const headList = ['Categoria', 'Quantidade', 'Total'];

  const handleSelectedCategory = (id: number, name: string) => {
    setCategory({id, name});
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
        reportType="card"
      />

      { !Array.isArray(data) && 
        (
          <TableReport 
            reportType="card"
            data={data.data}
            headList={headList}
            variant='striped'
            colorScheme={colorScheme}
            openModal={handleSelectedCategory}
          />
        ) 
      }
    
    </>
  )
}
