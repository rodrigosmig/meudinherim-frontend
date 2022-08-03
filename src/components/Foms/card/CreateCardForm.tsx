import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { CancelButton } from "../../Buttons/Cancel";
import { cardService } from "../../../services/ApiService/CardService";
import { getMessage } from "../../../utils/helpers";
import { ICardFormData } from "../../../types/card";
import { createValidation } from "../../../validations/card";
import { useQueryClient } from "react-query";

interface CreateCardFormProps {
  onClose: () => void
}

export const CreateCardForm = ({ onClose }: CreateCardFormProps) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const handleCreateCard: SubmitHandler<ICardFormData> = async (values) => {
    try {
      await cardService.create(values)

      getMessage("Sucesso", `Cartão de Crédito ${values.name} criado com sucesso`);

      queryClient.invalidateQueries('cards')
      queryClient.invalidateQueries('cards-form')

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

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateCard)}
      >
      <Stack spacing={[4]}>
        <Input
          name="name"
          type="text"
          label="Nome do Cartão"
          error={errors.name}
          {...register('name')}
        />

        <Input
          name="credit_limit"
          type="number"
          label="Limite de Crédito"
          error={errors.credit_limit}
          {...register('credit_limit')}
        />

        <Input
          name="closing_day"
          type="number"
          label="Dia do Fechamento"
          error={errors.closing_day}
          {...register('closing_day')}
        />

        <Input
          name="pay_day"
          type="number"
          label="Dia do Pagamento"
          error={errors.pay_day}
          {...register('pay_day')}
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