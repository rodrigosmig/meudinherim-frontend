import { Flex } from "@chakra-ui/react";
import Head from "next/head";

import { RegisterForm } from "../components/Foms/auth/RegisterForm";

export default function Register() {  
  return (
    <>
      <Head>
        <title>Cadastrar | Meu Dinherim</title>
      </Head>

      <Flex
        w={['100vw']}
        h={['100vh']}
        align={['center']}
        justify={['center']}
      >
        
        <RegisterForm />

      </Flex>
    </>
  )
}