import {
  Box,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import Head from "next/head";

import { RegisterForm } from "../components/Foms/auth/RegisterForm";
import { ChangeTheme } from "../components/Layout/Header/ChangeTheme";

export default function Register() {  
  return (
    <>
      <Head>
        <title>Cadastrar | Meu Dinherim</title>
      </Head>

      <Box bg={useColorModeValue('gray.50', 'gray.900')} p={2}>
        <ChangeTheme />
      </Box>

      <Flex
        w={['100vw']}
        h={['100vh']}
        align={['center']}
        justify={['center']}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        
        <RegisterForm />

      </Flex>
    </>
  )
}