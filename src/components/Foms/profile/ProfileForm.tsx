import { ChangeEvent, useState } from 'react';
import { Flex, Stack } from "@chakra-ui/react";
import { profileService } from '../../../services/ApiService/ProfileService';
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { SubmitButton } from "../../Buttons/Submit";
import { Switch } from "../../Inputs/Switch";
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from '../../../utils/helpers';
import { IProfileUpdateData, IProfileUpdateDataError, IProfileUpdateDataErrorKey } from '../../../types/auth';
import { useUser } from '../../../hooks/useUser';
import { profileValidation } from '../../../validations/auth';

export function ProfileForm() {
  const { user, setUser } = useUser();
  const [ enableNotification, setEnableNotification ] = useState(user.enable_notification);
  
  const { register, handleSubmit, setError, setValue, getValues, formState } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      enable_notification: user.enable_notification
    },
    resolver: yupResolver(profileValidation)
  });
  
  const { errors } = formState;

  const handleUpdateProfile: SubmitHandler<IProfileUpdateData> = async (values) => {
    if (values.name && user.name 
      && values.email === user.email 
      && values.enable_notification === user.enable_notification
    ) {
      return getMessage("Sem alteração", "Nenhuma alteração foi realizada", "warning", 2000);
    }

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
        const data: IProfileUpdateDataError = error.response.data;

        let key: IProfileUpdateDataErrorKey;
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }
    }    
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
        />

        <Input 
          name="email"
          type="email"
          label="E-mail"
          error={errors.email}
          {...register('email')}
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
      />
    </Flex>
  )
}