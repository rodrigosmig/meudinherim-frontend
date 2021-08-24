import { FormControl, FormErrorMessage, FormLabel, Select as ChakraSelect, SelectProps as ChakraSelectProps  } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: {
    value: string;
    label: string;
  }[]
}

export const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = ({ name, label, error=null, options, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>
        {label}
      </FormLabel>
      
      <ChakraSelect
        id={name}
        name={name}
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900'
        }}
        size='lg'
        ref={ref}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
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