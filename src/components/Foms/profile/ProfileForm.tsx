import { Flex, Stack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from '../../../hooks/useUser';
import { profileService } from '../../../services/ApiService/ProfileService';
import { IProfileUpdateData, IProfileUpdateDataError, IProfileUpdateDataErrorKey } from '../../../types/auth';
import { getMessage } from '../../../utils/helpers';
import { profileValidation } from '../../../validations/auth';
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from '../../Inputs/Input';
import { Switch } from "../../Inputs/Switch";

export function ProfileForm() {
  const { user, setUser } = useUser();
  const [ enableNotification, setEnableNotification ] = useState(user.enable_notification);
  
  const { register, handleSubmit, setError, formState } = useForm({
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

      setUser(userUpdated);

      return getMessage("Sucesso", "Alteração realizada com sucesso");
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IProfileUpdateDataError = error.response.data;

        let key: IProfileUpdateDataErrorKey;
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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