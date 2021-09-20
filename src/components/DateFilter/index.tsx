import { memo } from 'react';
import { Button, chakra, Flex, Icon, IconButton, HStack } from '@chakra-ui/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from "date-fns/locale/pt-BR";
import { RiFilter2Line } from "react-icons/ri"

registerLocale("ptBR", ptBR);

import 'react-datepicker/dist/react-datepicker.css';

const StyledaDatepicker = chakra(DatePicker);

interface DatepickerFilterProps {
  startDate: Date;
  endDate: Date;
  isWideVersion: boolean;
  onChange: (date: [Date | null, Date | null]) => void;
  onClick: () => void;
}

const DateFilterComponent = ({ startDate, endDate, isWideVersion, onChange, onClick }: DatepickerFilterProps) => {
  return (
    <HStack spacing={3} mb={[6, 8]}>
      <Flex w={[200, 250]}>
        <StyledaDatepicker
            w={[200, 250]}
            h={[10, 12]}
            fontSize={["sm", "md"]}
            px={[2, 4]}
            borderRadius="0.375rem"
            bgColor="gray.900"            
            _focus={{
              outline: '2px solid #D53F8C',
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

      { isWideVersion ? (
        <Button
          aria-label="Filter"
          colorScheme="purple"
          leftIcon={<Icon as={RiFilter2Line} fontSize="16" />}
          onClick={onClick}
          
        >
          Filtrar
        </Button>
      ) : (
        <IconButton
          size="sm"
          aria-label="Filter"
          colorScheme="purple" 
          icon={<RiFilter2Line />} 
          onClick={onClick}
        />
      )}

        
    </HStack>
  )
}

export const DateFilter = memo(DateFilterComponent);