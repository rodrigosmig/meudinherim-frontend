import { ChangeEvent, useContext, useState } from 'react';
import { Flex, Stack, useToast } from "@chakra-ui/react";
import { profileService } from '../../services/ApiService/ProfileService';
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../Inputs/Input';
import { SubmitButton } from "../Inputs/SubmitButton";
import { Switch } from "../Inputs/Switch";
import { AuthContext } from '../../contexts/AuthContext';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type ProfileFormData = {
  name: string
  email: string;
  enable_notification: boolean;
}

interface User {
  id: number;
  name: string
  email: string;
  avatar: string;
  enable_notification: boolean;
}

interface ProfileFormProps {
  updateUser: (user: User) => void
}

const validationSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido")
})

export function ProfileForm({ updateUser }: ProfileFormProps) {
  const { user } = useContext(AuthContext);
  const [ name, setName ] = useState(user.name);
  const [ email, setEmail ] = useState(user.email);
  const [ enableNotification, setEnableNotification ] = useState(user.enable_notification);
  
  const toast = useToast();
  const { register, handleSubmit, setError, setValue, getValues, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  setValue('name', name)
  setValue('email', email)
  
  const { errors } = formState;

  const handleUpdateProfile: SubmitHandler<ProfileFormData> = async (values) => {
    try {
      const response = await profileService.updateProfile(values)
      const userUpdated = response.data

      updateUser(userUpdated)

      toast({
        title: "Sucesso",
        description: "Alteração realizada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })
    } catch (error) {
      if (error.response?.status === 422) {
        const data = error.response.data;

        for (const key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }
    }    
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>, type: 'name' | 'email' ) => {
    const value = event.target.value;
    setValue(type, value);

    if (type === 'email') {
      setEmail(value);
    } else {
      setName(value)
    }
  }

  const hasChange = () => {
    return  getValues('name') === user.name && getValues('email') === user.email && enableNotification === user.enable_notification
  }

  return (
    <Flex 
    as="form"
    w={['100%']}
    flexDir={["column"]}
    bg="gray.800"
    onSubmit={handleSubmit(handleUpdateProfile)}
    >
      <Stack spacing={[4]}>
        <Input 
          name="name"
          type="text"
          label="Nome"
          error={errors.name}
          {...register('name')}
          onChange={event => onChange(event, 'name')}
        />

        <Input 
          name="email"
          type="email"
          label="E-mail"
          error={errors.email}
          {...register('email')}
          onChange={event => onChange(event, 'email')}
        />

        <Switch
          id="notifications" 
          name='enable_notification'
          label="Receber notificações"
          {...register('enable_notification')}
          isChecked={enableNotification}
          onChange={e => setEnableNotification(!enableNotification)}
        />

      </Stack>

      <SubmitButton
        mt={[6]}
        label="Alterar"
        size="md"
        isLoading={formState.isSubmitting}
        isDisabled={hasChange()}
      />
    </Flex>
  )
}