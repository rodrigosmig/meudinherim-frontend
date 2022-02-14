import { 
  Box, 
  Table as ChakraTable, 
  TableProps as ChakraTableProps,
  useColorMode
} from "@chakra-ui/react"
import { ReactNode } from "react"

interface Props extends ChakraTableProps {
  tableSize: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Table = ({ tableSize, children, ...rest }: Props) => {
  const { colorMode } = useColorMode();

  const colorScheme = colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'

  return (
    <Box overflowX="auto">
      <ChakraTable 
        size={tableSize} 
        colorScheme={colorScheme}
        {...rest}
      >
        { children }
      </ChakraTable>
    </Box>
  )
}