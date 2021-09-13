import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FormControl, FormErrorMessage, chakra } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form'
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from "date-fns/locale/pt-BR";

registerLocale("ptBR", ptBR);

import 'react-datepicker/dist/react-datepicker.css';

const StyledaDatepicker = chakra(DatePicker);

interface DatepickerProps {
  selected: Date;
  error?: FieldError;
  onChange: (date: Date) => void;
}

const DatepickerBase: ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = ({ selected, error=null, onChange, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      <StyledaDatepicker
        w={240}
        h={50}
        px={4}
        borderRadius="0.375rem"
        bgColor="gray.900"        
        _focus={{
          outline: '2px solid #D53F8C',
        }}
        dateFormat="dd/MM/yyyy"
        locale={ptBR}
        selected={selected} 
        onChange={onChange} 
        ref={ref}
        {...rest}
      />
      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

export const Datepicker = forwardRef(DatepickerBase);