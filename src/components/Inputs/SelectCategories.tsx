import { 
  FormControl, 
  FormErrorMessage, 
  FormLabel, 
  Select as ChakraSelect, 
  SelectProps as 
  ChakraSelectProps, 
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface SelectCategoriesProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: {
    income: {
      id: number;
      label: string;
    }[],
    expense: {
      id: number;
      label: string;
    }[]
  }
}

export const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectCategoriesProps> = ({ name, label, error=null, options, ...rest }, ref) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverColor = useColorModeValue('white', 'gray.900');

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>
        {label}
      </FormLabel>
      
      <ChakraSelect
        id={name}
        name={name}
        focusBorderColor="pink.500"
        bgColor={bgColor}
        ref={ref}
        {...rest}
      >
        <optgroup label="Entrada">
          {options.income.map(category => (
            <option key={category.id} value={category.id}>{category.label}</option>))}
        </optgroup>
        <optgroup label="Saída">
          {options.expense.map(category => (
            <option  key={category.id} value={category.id}>{category.label}</option>
          ))}
        </optgroup>
      </ChakraSelect>

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

export const SelectCategories = forwardRef(SelectBase);