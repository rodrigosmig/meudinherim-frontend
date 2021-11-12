import {
  Box,
  Flex, 
  Heading, 
  Image,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { withSsrGuest } from '../utils/withSSRGuest';
import { LoginForm } from "../components/Foms/auth/LoginForm";
import Head from "next/head";
import { ChangeTheme } from "../components/Layout/Header/ChangeTheme";

export default function SignIn() {
  const { colorMode } = useColorMode()

  const url_logo = colorMode === "dark" ? '/icons/logo_white.png' : '/icons/logo_black.png'

  return (
    <>
      <Head>
        <title>Meu Dinherim</title>
      </Head>

      <Box bg={useColorModeValue('gray.50', 'gray.900')} p={2}>
        <ChangeTheme />
      </Box>
      
      <Flex
        w={['100vw']}
        h={['100vh']}
        align={['center']}
        justify={['center']}
        direction={'column'}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Flex justify="center" align="center" mb={[6]}>
          <Image
            alt="Meu Dinherim"
            w={[10]}
            h={[10]}
            src={url_logo}
            objectFit="cover"
            mr={[6]}
          />

          <Heading>
            Meu Dinherim
          </Heading>

        </Flex>

        <LoginForm />
        
      </Flex>
    </>  
  )
}

export const getServerSideProps = withSsrGuest(async (context) => {
  return {
    props: {}
  }
})