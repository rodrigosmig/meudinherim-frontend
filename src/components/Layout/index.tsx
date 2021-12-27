
import { memo, ReactNode } from 'react';
import { Box, BoxProps, Text, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from '../Card';

interface LayoutProps extends BoxProps {
  isDashboard?: boolean
  children: ReactNode
}

const LayoutComponent = ({ children, isDashboard = false, }: LayoutProps) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Header />   
        <Box 
          ml={{ base: 0, md: 60 }} 
          p="4" 
          bg={bgColor}
        >
          { isDashboard ? (
            children
          ) : (
            <Card>
              {children}
            </Card>
          ) }       

        </Box>

    </Box>

  )
}

export const Layout = memo(LayoutComponent);