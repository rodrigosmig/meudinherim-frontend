
import { memo, ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactElement
}

const LayoutComponent = ({ children }: LayoutProps) => {
  return (
    <>
      <Flex
        flexDir={['column']}
        h={["100vh"]}
      >        
        <Header />
        <Flex
          w={['full']}
          mx={['auto']}
          my={[6]}
          px={[6]}
        >
          <Sidebar />

          { children }

        </Flex>
      </Flex>
    </>
  )
}

export const Layout = memo(LayoutComponent);