
import { memo, ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode
}

const LayoutComponent = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh">
      <Sidebar />
      <Header />
   
        <Box ml={{ base: 0, md: 60 }} p="4">
          <Box 
            w={"full"}
            flex='1' 
            borderRadius={8} 
            bg="gray.800" p="8" 
            h="max-content"
            
          >     
            {children}

          </Box>
        </Box>

    </Box>

  )
}

export const Layout = memo(LayoutComponent);