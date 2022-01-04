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
import { Select } from "../../Inputs/Select";
import { getMessage, toBrDate, toCurrency } from "../../../utils/helpers";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";
import { useQueryClient } from "react-query";
import { payableService } from "../../../services/ApiService/PayableService";

interface Invoice {
  id: number;
  due_date: string;
  closing_date: string;
  amount: number;
  paid: boolean;
  isClosed: boolean;
  card: {
    id: number;
    name: string;
  }
}

type ResponseError = {
  category_id: string[];
}

type Key = keyof ResponseError;

interface FormData {
  category_id: number;
}

const validationSchema = yup.object().shape({
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
})

interface GeneratePaymentFormProps {
  invoice: Invoice;
  onCancel: () => void;
}

export const GeneratePaymentForm = ({ invoice, onCancel }: GeneratePaymentFormProps) => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      category_id: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const payableDescription = `Fatura: ${invoice.card.name}`;

  const handleTransfer: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
      due_date: invoice.due_date,
      description: payableDescription,
      value: invoice.amount,
      invoice_id: invoice.id
    }

    try {
      await payableService.create(data);

      getMessage("Sucesso", "Conta a pagar gerado com sucesso");

      queryClient.invalidateQueries('open_invoices');
      queryClient.invalidateQueries('invoice');
      
      onCancel();
    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;

        let key: Key        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }

      if (error.response?.status === 400) {
        const message = error.response.data.message;

        getMessage('Erro', message, 'error');
      }
    }
  }

  const getExpenseCategories = () => {
    return categories?.expense.map(category => {
      return {
        value: category.id,
        label: category.label
      }
    })
  }

  if (isLoadingCategories) {
    return (
      <Loading />
    )
  } 

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleTransfer)}
    >
      <Stack spacing={[4]} mt={4}>
        <Select
          name="type"
          label="Categoria"
          options={getExpenseCategories()}
          error={errors.category_id}
          {...register('category_id')}
        />
        <Input
          value={toBrDate(invoice?.due_date)}
          name="due_date"
          type="text"
          label="Vencimento"
          isDisabled={true}
        />
        <Input
          value={payableDescription}
          name="description"
          type="text"
          label="Descrição"
          isDisabled={true}
        />

        <Input
          value={toCurrency(invoice?.amount)}
          name="value"
          type="text"
          label="Valor"
          isDisabled={true}
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
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <SubmitButton
          label="Gerar Pagamento"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}