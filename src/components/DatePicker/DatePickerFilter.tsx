import { memo } from 'react';
import { chakra, Flex } from '@chakra-ui/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from "date-fns/locale/pt-BR";

registerLocale("ptBR", ptBR);

import 'react-datepicker/dist/react-datepicker.css';

const StyledaDatepicker = chakra(DatePicker);

interface DatepickerFilterProps {
  startDate: Date;
  endDate: Date;
  onChange: (date: [Date | null, Date | null]) => void;
}

const DateFilterComponent = ({ startDate, endDate, onChange }: DatepickerFilterProps) => {
  return (
    <Flex w={[200, 250]}>
      <StyledaDatepicker
        w={[200, 250]}
        h={[10]}
        px={4}
        borderRadius="0.375rem"
        focusBorderColor="white"
        bgColor="gray.900"        
        _hover={{
          bgColor: 'gray.900'
        }}
        dateFormat="dd/MM/yyyy"
        locale={ptBR}
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        isClearable={true}
        placeholderText={"Filtrar por período"}
      />

    </Flex>
  )
}

export const DatepickerFilter = memo(DateFilterComponent);