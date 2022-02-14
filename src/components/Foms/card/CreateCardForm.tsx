import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { CancelButton } from "../../Buttons/Cancel";
import { cardService } from "../../../services/ApiService/CardService";
import { getMessage } from "../../../utils/helpers";
import { ICardFormData } from "../../../types/card";

interface CreateCardFormProps {
  closeModal: () => void,
  refetch: () => void
}

const validationSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  pay_day: yup.number().typeError("O campo dia do pagamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  closing_day: yup.number().typeError("O campo dia do fechamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  credit_limit: yup.number().positive("O campo limite de crédito deve ser maior que zero")
    .typeError("O campo limite de crédito é obrigatório")
});

export const CreateCardForm = ({ closeModal, refetch }: CreateCardFormProps) => {
  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleCreateCard: SubmitHandler<ICardFormData> = async (values) => {
    try {
      await cardService.create(values)

      getMessage("Sucesso", `Cartão de Crédito ${values.name} criado com sucesso`);

      refetch();
      closeModal();

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
          onClick={closeModal}
        />

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}