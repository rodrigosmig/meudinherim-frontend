
import { memo, ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode
}

const LayoutComponent = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar />
      <Header />
   
        <Box 
          ml={{ base: 0, md: 60 }} 
          p="4" 
          bg={useColorModeValue('gray.50', 'gray.900')}
        >
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            w={"full"}
            flex='1' 
            borderRadius={8} 
            p="8" 
            h="max-content"
            
          >     
            {children}

          </Box>
        </Box>

    </Box>

  )
}

export const Layout = memo(LayoutComponent);