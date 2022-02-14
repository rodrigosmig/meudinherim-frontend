import { 
  FormControl, 
  FormErrorMessage,
  FormLabel, 
  Select as ChakraSelect, 
  SelectProps as ChakraSelectProps, 
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface Props extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: {
    value: string | number;
    label: string;
  }[]
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, Props> = ({ name, label, error = null, options, ...rest }, ref) => {
  

  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      
      <ChakraSelect
        id={name}
        name={name}
        focusBorderColor="pink.500"
        ref={ref}
        {...rest}
      >
        {options.map(option => (
          <Text as="option" key={option.value} value={option.value}>{option.label}</Text>
        ))}
      </ChakraSelect>

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

export const Select = forwardRef(SelectBase);