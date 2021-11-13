import { forwardRef, ForwardRefRenderFunction } from 'react';
import { 
  chakra,
  FormControl, 
  FormLabel, 
  FormErrorMessage, 
  useColorModeValue
} from '@chakra-ui/react';
import { FieldError } from 'react-hook-form'
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from "date-fns/locale/pt-BR";

registerLocale("ptBR", ptBR);

import 'react-datepicker/dist/react-datepicker.css';

const StyledaDatepicker = chakra(DatePicker);

interface DatepickerProps {
  selected: Date;
  label?: string;
  error?: FieldError;
  onChange: (date: Date) => void;
}

const DatepickerBase: ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = ({ label, selected, error=null, onChange, ...rest }, ref) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("#B3B5C6", "#353646");
  const hoverColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={label}>{label}</FormLabel>}

      <StyledaDatepicker
        id={label}
        w={"full"}
        h={[10]}
        px={4}
        borderRadius="0.375rem"
        outline={`1px solid ${borderColor}`}
        bgColor={bgColor}
        _focus={{
          outline: '2px solid #D53F8C',
        }}
        _hover={{
          bgColor: hoverColor
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