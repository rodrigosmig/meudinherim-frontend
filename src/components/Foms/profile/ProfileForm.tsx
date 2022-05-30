import { ChangeEvent, useState } from 'react';
import { Flex, Stack } from "@chakra-ui/react";
import { profileService } from '../../../services/ApiService/ProfileService';
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { SubmitButton } from "../../Buttons/Submit";
import { Switch } from "../../Inputs/Switch";
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from '../../../utils/helpers';
import { IProfileUpdateData } from '../../../types/auth';
import { useUser } from '../../../hooks/useUser';
import { profileValidation } from '../../../validations/auth';

export function ProfileForm() {
  const { user, setUser } = useUser();
  const [ name, setName ] = useState(user.name);
  const [ email, setEmail ] = useState(user.email);
  const [ enableNotification, setEnableNotification ] = useState(user.enable_notification);
  
  const { register, handleSubmit, setError, setValue, getValues, formState } = useForm({
    resolver: yupResolver(profileValidation)
  });

  setValue('name', name)
  setValue('email', email)
  
  const { errors } = formState;

  const handleUpdateProfile: SubmitHandler<IProfileUpdateData> = async (values) => {
    try {
      const response = await profileService.updateProfile(values)
      const userUpdated = response.data

      /* if (!userUpdated.hasEmailVerified) {
        getMessage("Atenção", "Uma mensagem com um link de confirmação foi enviada para seu e-mail.", 'warning');
        
        setTimeout(() => {
          signOut();
        }, 1000);

        return;
      } */

      setUser(userUpdated);

      return getMessage("Sucesso", "Alteração realizada com sucesso");
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
        isLoading={formState.isSubmitting}
        isDisabled={hasChange()}
      />
    </Flex>
  )
}