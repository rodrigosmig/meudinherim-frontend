import { Box, Table as ChakraTable, TableProps as ChakraTableProps } from "@chakra-ui/react"
import { ReactElement } from "react"

interface TableProps extends ChakraTableProps {
  tableSize: 'sm' | 'md' | 'lg';
  children: ReactElement;
}

export const Table = ({ tableSize, children }: TableProps) => {
  return (
    <Box overflowX="auto">
      <ChakraTable size={tableSize} colorScheme="whiteAlpha">
        { children }
      </ChakraTable>
    </Box>
  )
}