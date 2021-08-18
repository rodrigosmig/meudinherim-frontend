import { forwardRef, ForwardRefRenderFunction } from 'react';
import { 
  FormControl, 
  FormLabel, 
  Switch as ChakraSwitch, 
  SwitchProps as ChakraSwitchProps 
} from "@chakra-ui/react";

interface SwitchProps extends ChakraSwitchProps {
  id: string;
  label: string
}

const SwitchBase: ForwardRefRenderFunction<HTMLInputElement, SwitchProps> = ({ id, label, ...rest }, ref) => {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor={id} mb="0">
        {label}
      </FormLabel>

      <ChakraSwitch
        id={id}
        size="md" 
        colorScheme="pink"
        ref={ref}
        {...rest}
      />
    </FormControl>
  )
}

export const Switch = forwardRef(SwitchBase);