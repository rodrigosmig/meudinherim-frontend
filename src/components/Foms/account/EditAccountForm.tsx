import { 
  Box,
  Button,
  Flex,
  Stack, 
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { accountService } from '../../../services/ApiService/AccountService';
import { ACCOUNTS, ACCOUNTS_FORM, ACCOUNT_BALANCE, getMessage } from "../../../utils/helpers";
import { IAccountErrorKey, IAccount, IAccountFormData, IAccountResponseError } from "../../../types/account";
import { editValidation } from "../../../validations/account";
import { Switch } from "../../Inputs/Switch";
import { useState } from "react";
import { useQueryClient } from "react-query";

interface Props {
  account: IAccount;
  onClose: () => void,
}

export const EditAccountForm = ({ account, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [ isActive, setIsActive ] = useState(account.active);

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: account.type.id,
      name: account.name,
      active: account.active
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
        active: values.active
      }
    }

    try {
      await accountService.update(data);

      getMessage("Sucesso", "Alteração realizada com sucesso");

      queryClient.invalidateQueries(ACCOUNTS)
      queryClient.invalidateQueries(ACCOUNTS_FORM)
      queryClient.invalidateQueries(ACCOUNT_BALANCE)

      onClose();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountResponseError = error.response.data;

        let key: IAccountErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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

        <Switch
          size="lg"
          id="active" 
          name='active'
          label="Ativo"
          {...register('active')}
          isChecked={isActive}
          onChange={() => setIsActive(!isActive)}
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
          onClick={onClose}
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