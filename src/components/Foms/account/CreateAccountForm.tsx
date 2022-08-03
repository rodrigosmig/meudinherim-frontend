import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { accountService } from '../../../services/ApiService/AccountService';
import { Select } from "../../Inputs/Select";
import { CancelButton } from "../../Buttons/Cancel";
import { getMessage } from "../../../utils/helpers";
import { IAccountFormData } from "../../../types/account";
import { createValidation } from "../../../validations/account";
import { useQueryClient } from "react-query";

interface Props {
  onClose: () => void,
}

export const CreateAccountForm = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const handleCreateAccount: SubmitHandler<IAccountFormData> = async (values) => {
    try {
      await accountService.create(values);

      getMessage("Sucesso", `Conta ${values.name} criada com sucesso`);

      queryClient.invalidateQueries('accounts')
      queryClient.invalidateQueries('accounts-form')

      onClose();

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

  const options = [
    {value: "money", label: "Dinheiro"},
    {value: "savings", label: "Poupança"},
    {value: "checking_account", label: "Conta Corrente"},
    {value: "investment", label: "Investimentos"}
  ];

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateAccount)}
      >
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Tipo"
          options={options}
          error={errors.type}
          {...register('type')}
        />

        <Input
          name="name"
          type="text"
          label="Nome da Conta"
          error={errors.name}
          {...register('name')}
        />
      </Stack>
      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <CancelButton
          mr={4}
          isDisabled={formState.isSubmitting}
          onClick={onClose}
        />

        <SubmitButton
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}