import { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { theme } from '../styles/theme';

import { AuthProvider } from '../contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

import 'nprogress/nprogress.css';
import { DateFilterProvider } from '../contexts/DateFilterContext';

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <QueryClientProvider client={queryClient}>
            <DateFilterProvider>
              <Component {...pageProps} />
            </DateFilterProvider>
            <ReactQueryDevtools/>
          </QueryClientProvider>
        </SidebarDrawerProvider>
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
