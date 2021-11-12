import { 
  FormLabel, 
  FormControl, 
  FormErrorMessage, 
  Input as ChakraInput, 
  InputProps as ChakraInputProps ,
  useColorModeValue
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, error=null, ...rest }, ref) => {
  const color = useColorModeValue('gray.50', 'gray.900');

  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      
      <ChakraInput
        id={name}
        name={name}
        focusBorderColor="pink.500"
        _hover={{
          bgColor: color
        }}
        ref={ref}
        {...rest}
      />

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

export const Input = forwardRef(InputBase);