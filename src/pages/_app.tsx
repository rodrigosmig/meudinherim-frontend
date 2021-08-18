import { AppProps } from 'next/app'
import Router from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import NProgress from 'nprogress';

import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { AuthProvider } from '../contexts/AuthContext';

import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
