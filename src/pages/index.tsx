import { Flex, Heading, Icon, Image, Text } from "@chakra-ui/react";
import { withSsrGuest } from '../utils/withSSRGuest';
import { LoginForm } from "../components/Foms/LoginForm";
import Head from "next/head";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Meu Dinherim</title>
      </Head>
      
      <Flex
        w={['100vw']}
        h={['100vh']}
        align={['center']}
        justify={['center']}
        direction={'column'}
      >
        <Flex justify="center" align="center" mb={[6]}>
          <Image
            w={[10]}
            h={[10]}
            src="/icons/logo.png"
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