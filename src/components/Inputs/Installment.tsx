import { 
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useState
} from "react";
import {
  Box,
  Text,
  SelectProps,
  Stack,
} from "@chakra-ui/react";
import { FieldError } from 'react-hook-form'
import { Select } from "./Select"
import { toCurrency } from "../../utils/helpers";

interface Props extends SelectProps {
  amount: number;
  isChecked: boolean;
  error?: FieldError;
}

const InstallmentBase: ForwardRefRenderFunction<HTMLSelectElement, Props> = ({ amount, isChecked, error = null, ...rest }, ref) => {
  const [ installmentValue, setInstallmentValue ] = useState(0)
  const [ installmentNumber, setInstallmentNumber ] = useState(2)

  useEffect(() => {
    setInstallmentValue(amount / installmentNumber);
  }, [amount, installmentNumber])

  const options = [2,3,4,5,6,7,8,9,10,11,12].map((value) => {
    return {
      value: String(value),
      label: String(value)
    }
  })

  const handleChangeInstallment = (event: ChangeEvent<HTMLSelectElement>) => {
    setInstallmentNumber(parseInt(event.target.value));
    setInstallmentValue(amount / installmentNumber);
  }

  return (
    <Stack spacing={6} mt={6}>
      { isChecked && (
        <>
          <Select
            w={160}
            name="installment_number"
            label="Numero de parcelas"
            options={options}
            ref={ref}
            {...rest}
            error={error}
            onChange={handleChangeInstallment}
          />

      <Text fontWeight="bold">
        Valor da Parcela: <Box as="span" color="blue.500">{toCurrency(installmentValue)}</Box>
      </Text>
        </>
      )}
    </Stack>
  )  
}

export const Installment = forwardRef(InstallmentBase);