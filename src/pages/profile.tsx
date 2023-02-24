import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from "next/head";
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupApiClient } from '../services/api';
import { Layout } from '../components/Layout';
import { FileInput } from '../components/Inputs/FileInput';
import { 
  Box,
  Flex,
  Heading as ChakraHeading, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs, 
  Text 
} from '@chakra-ui/react';
import { ProfileForm } from '../components/Foms/profile/ProfileForm';
import { Loading } from '../components/Loading/index';
import { ChangePasswordForm } from '../components/Foms/profile/ChangePasswordForm';
import { Heading } from '../components/Heading';
import { IUser } from '../types/auth';
import { useUser } from '../hooks/useUser';
import { useSelector } from '../hooks/useSelector';


interface Props {
  userUpdated: IUser;
}

export default function Profile({ userUpdated }: Props) {
  const { isAuthenticated, user } = useSelector(({auth}) => auth)

  const [localImageUrl, setLocalImageUrl] = useState(user.avatar);  

  const {
    register,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  return (
    <>
      <Head>
        <title>Perfil | Meu Dinherim</title>
      </Head>

      <Layout>
        {
          !isAuthenticated 
            ? (
              <Loading />
            )
            : (
              <>
                <Flex justify="space-between" align="center">
                  <Heading>
                    <Text>Configuração de Perfil</Text>
                  </Heading>
                </Flex>

                <Box>
                  <Flex
                    flexDirection={"column"}
                    align="center"
                  >
                    <Box
                      width={['full', 'xs']}
                      bgColor="gray.900"
                      p={[4, 8]}
                      mt={[4]}
                    >
                      <FileInput
                        localImageUrl={localImageUrl}
                        setLocalImageUrl={setLocalImageUrl}
                        setError={setError}
                        trigger={trigger}
                        error={errors.image}
                        {...register('image')}
                      />                    
                    </Box>

                    <ChakraHeading mt={[6, 6, 8]} fontSize={['3xl', '4xl']}>
                      {user.name}
                    </ChakraHeading>

                    <Text fontSize={['sm', 'md']} mb={[6, 6, 8]}>
                      {user.email}
                    </Text>
                  </Flex>

                  <Box>
                    <Tabs colorScheme="pink">
                      <TabList>
                        <Tab>Perfil</Tab>
                        <Tab>Senha</Tab>
                      </TabList>

                      <TabPanels>
                        <TabPanel>
                          <ProfileForm />
                        </TabPanel>

                        <TabPanel>
                          <ChangePasswordForm />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </Box>
              </>
            )
        }        
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  
  const response = await apiClient.get('/auth/me');

  const userUpdated = response.data;

  return {
    props: {
      userUpdated
    }
  }
})