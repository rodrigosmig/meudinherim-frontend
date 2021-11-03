import { 
  FormLabel, 
  FormControl, 
  FormErrorMessage,    
  NumberInput,
  NumberInputProps,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form'

interface NumberProps extends NumberInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}
  
const NumberBase: ForwardRefRenderFunction<HTMLInputElement, NumberProps> = ({ name, label, error=null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <NumberInput
        id={name}
        step={0.01}
        focusBorderColor="pink.500" 
        variant="filled"
        {...rest}        
      >
        <NumberInputField
          name={name}
          bgColor="gray.900" 
          variant="filled" 
          _hover={{
              bgColor: 'gray.900'
          }} 
          ref={ref}       
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}
  
export const Number = forwardRef(NumberBase);