import { 
  Box,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { cardService } from "../../../services/ApiService/CardService";
import { CARDS, CARDS_FORM, getMessage, INVOICE, OPEN_INVOICES } from "../../../utils/helpers";
import { ICard, ICardErrorKey, ICardFormData, ICardResponseError } from "../../../types/card";
import { editValidation } from "../../../validations/card";
import { useQueryClient } from "react-query";

interface Props {
  card: ICard;
  onClose: () => void,
}

export const EditCardForm = ({ card, onClose }: Props) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      name: card.name,
      pay_day: card.pay_day,
      closing_day: card.closing_day,
      credit_limit: card.credit_limit,
      
    },
    resolver: yupResolver(editValidation)
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

      queryClient.invalidateQueries(CARDS)
      queryClient.invalidateQueries(CARDS_FORM)
      queryClient.invalidateQueries(INVOICE)
      queryClient.invalidateQueries(OPEN_INVOICES)

      onClose();

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