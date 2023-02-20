import { Flex, Stack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "../../../hooks/useDispatch";
import { useSelector } from "../../../hooks/useSelector";
import { updateUser } from "../../../store/thunks/authThunk";
import { IProfileUpdateData, IProfileUpdateDataError, IProfileUpdateDataErrorKey } from '../../../types/auth';
import { getMessage } from '../../../utils/helpers';
import { profileValidation } from '../../../validations/auth';
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from '../../Inputs/Input';
import { Switch } from "../../Inputs/Switch";

export function ProfileForm() {
  const router = useRouter();
  const { user } = useSelector(({auth}) => auth)
  const dispatch = useDispatch();
  
  const { register, watch, handleSubmit, setError, reset, formState } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      enable_notification: user.enable_notification
    },
    resolver: yupResolver(profileValidation)
  });

  const enableNotification = watch('enable_notification')
  
  const { errors } = formState;

  const handleUpdateProfile: SubmitHandler<IProfileUpdateData> = async (values) => {
    try {
      await dispatch(updateUser(values)).unwrap()

      if (formState.dirtyFields.email) {
        getMessage("Validação de e-mail", "O novo e-mail precisa ser verificado.", "warning");
        router.push("/auth/resend-verification-email")
        return;
      }

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

  useEffect(() => {
    reset({
      email: user.email,
      name: user.name,
      enable_notification: user.enable_notification
    })
  }, [reset, formState.isSubmitSuccessful, user.name, user.email, user.enable_notification])

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
        />

      </Stack>

      <SubmitButton
        mt={[6]}
        label="Alterar"
        isLoading={formState.isSubmitting}
        isDisabled={!formState.isDirty}
      />
    </Flex>
  )
}