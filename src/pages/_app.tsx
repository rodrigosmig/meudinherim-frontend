import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { theme } from '../styles/theme';

import { AuthProvider } from '../contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

import 'nprogress/nprogress.css';
import { DateFilterProvider } from '../contexts/DateFilterContext';
import { Analytics } from '../components/Analytics';
import * as gtag from '../utils/analytics'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <QueryClientProvider client={queryClient}>
            <DateFilterProvider>
              <Component {...pageProps} />
              <Analytics />
            </DateFilterProvider>
            <ReactQueryDevtools/>
          </QueryClientProvider>
        </SidebarDrawerProvider>
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
