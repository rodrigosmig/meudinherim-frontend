import { forwardRef, ForwardRefRenderFunction } from 'react';
import { 
  FormControl, 
  FormLabel, 
  Switch as ChakraSwitch, 
  SwitchProps as ChakraSwitchProps 
} from "@chakra-ui/react";

interface Props extends ChakraSwitchProps {
  id: string;
  label: string
}

const SwitchBase: ForwardRefRenderFunction<HTMLInputElement, Props> = ({ id, label, ...rest }, ref) => {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel w={100} htmlFor={id} mb="0">
        {label}
      </FormLabel>

      <ChakraSwitch
        id={id}
        colorScheme="pink"
        ref={ref}
        {...rest}
      />
    </FormControl>
  )
}

export const Switch = forwardRef(SwitchBase);