import { 
  Box,
  Button,
  Flex,
  Stack, 
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { accountService } from '../../../services/ApiService/AccountService';
import { getMessage } from "../../../utils/helpers";
import { IAccountErrorKey, IAccount, IAccountFormData, IAccountResponseError } from "../../../types/account";
import { editValidation } from "../../../validations/account";

interface Props {
  account: IAccount;
  closeModal: () => void,
  refetch: () => void
}

export const EditAccountForm = ({ account, closeModal, refetch }: Props) => {
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: account.type.id,
      name: account.name
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditAccount: SubmitHandler<IAccountFormData> = async (values) => {
    const data = {
      accountId: account.id,
      data: {
        type: values.type,
        name: values.name,
      }
    }

    try {
      await accountService.update(data);

      getMessage("Sucesso", "Alteração realizada com sucesso");

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountResponseError = error.response.data;

        let key: IAccountErrorKey        
        for (key in data) {          
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
      onSubmit={handleSubmit(handleEditAccount)}
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
        <Button
          mr={[4]}
          variant="outline"
          isDisabled={formState.isSubmitting}
          onClick={closeModal}
        >
          Cancelar
        </Button>

        <SubmitButton
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}