import { 
  Box,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { cardService } from "../../../services/ApiService/CardService";
import { getMessage } from "../../../utils/helpers";
import { ICard, ICardErrorKey, ICardFormData, ICardResponseError } from "../../../types/card";

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

interface Props {
  card: ICard;
  closeModal: () => void,
  refetch: () => void
}

export const EditCardForm = ({ card, closeModal, refetch }: Props) => {
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      name: card.name,
      pay_day: card.pay_day,
      closing_day: card.closing_day,
      credit_limit: card.credit_limit,
      
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleEditAccount: SubmitHandler<ICardFormData> = async (values) => {
    const data = {
      cardId: card.id,
      data: {
        name: values.name,
        pay_day: values.pay_day,
        closing_day: values.closing_day,
        credit_limit: values.credit_limit,
      }
    }

    try {
      await cardService.update(data);

      getMessage("Sucesso", "Alteração realizada com sucesso");

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ICardResponseError = error.response.data;

        let key: ICardErrorKey
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
        <Input
          name="name"
          type="text"
          label="Nome da Conta"
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