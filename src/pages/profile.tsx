import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from "next/head";
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupApiClient } from '../services/api';
import { Card } from '../components/Card';
import { Layout } from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
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

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  enable_notification: boolean;
}

interface ProfileProps {
  userUpdated: User;
}

export default function Profile({ userUpdated }: ProfileProps) {
  const { user, isAuthenticated, setUser } = useContext(AuthContext);
  const [localImageUrl, setLocalImageUrl] = useState(userUpdated.avatar);  

  const handleUpdateUser = (user: User) => {
    setUser(user)
  }

  const {
    register,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  if(!isAuthenticated) {
    return(
      <Loading />
    )
  }

  return (
    <>
      <Head>
        <title>Perfil | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
            <Flex justify="space-between" align="center">
              <Heading>
                <Text>Perfil</Text>
              </Heading>
            </Flex>
            <FileInput
              localImageUrl={localImageUrl}
              setLocalImageUrl={setLocalImageUrl}
              updateUser={handleUpdateUser}
              setError={setError}
              trigger={trigger}
              error={errors.image}
              {...register('image')}
            />

            <Box align="center">
              <ChakraHeading mt={[6, 6, 8]} fontSize={['3xl', '4xl']}>
                {user.name}
              </ChakraHeading>

              <Text fontSize={['sm', 'md']} mb={[6, 6, 8]}>
                {user.email}
              </Text>

              <Box >
                <Tabs colorScheme="pink">
                  <TabList>
                    <Tab>Perfil</Tab>
                    <Tab>Senha</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <ProfileForm updateUser={handleUpdateUser}/>
                    </TabPanel>

                    <TabPanel>
                      <ChangePasswordForm />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </>
        </Card>
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