import { 
  Box, 
  Table as ChakraTable, 
  TableProps as ChakraTableProps,
  useColorMode
} from "@chakra-ui/react"
import { ReactNode } from "react"

interface TableProps extends ChakraTableProps {
  tableSize: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Table = ({ tableSize, children }: TableProps) => {
  const { colorMode } = useColorMode();

  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'

  return (
    <Box overflowX="auto">
      <ChakraTable size={tableSize} colorScheme={colorScheme}>
        { children }
      </ChakraTable>
    </Box>
  )
}