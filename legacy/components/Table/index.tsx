import {
  Box,
  Table as ChakraTable,
  TableProps as ChakraTableProps, 
  Text,
  Th,
  Thead,
  Tr,
  useColorMode
} from "@chakra-ui/react";
import { memo, ReactNode } from "react";

interface Props extends ChakraTableProps {
  theadData: string[];
  isEmpty?: boolean;
  showAdditionalColumn?: boolean;
  children: ReactNode;
}

const TableComponent = ({ 
  theadData, 
  isEmpty = false,
  showAdditionalColumn = true,
  children, 
  ...rest 
}: Props) => {
  const { colorMode } = useColorMode();

  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'

  return (
    <Box overflowX="auto">
      { isEmpty 
        ? (
          <Text fontWeight={"bold"} mt={[4]}>
            Nenhum registro encontrado
          </Text>
        ) : (
          <ChakraTable         
            colorScheme={colorScheme}
            {...rest}
          >
            <Thead>
              <Tr>
                { theadData.map(head => (
                    <Th key={head}>{ head }</Th>
                  ))
                }            
                { showAdditionalColumn && <Th w="8"></Th> }
              </Tr>
            </Thead>
            
            { children }

          </ChakraTable>
        )}      
    </Box>
  )
}

export const Table = memo(TableComponent);