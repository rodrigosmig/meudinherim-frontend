import { memo } from 'react';
import { 
  Button, 
  chakra, 
  Flex, 
  Icon, 
  IconButton, 
  HStack, 
  useColorModeValue 
} from '@chakra-ui/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from "date-fns/locale/pt-BR";
import { RiFilter2Line } from "react-icons/ri"

registerLocale("ptBR", ptBR);

import 'react-datepicker/dist/react-datepicker.css';

const StyledaDatepicker = chakra(DatePicker);

interface DatepickerFilterProps {
  label?: string;
  startDate: Date;
  endDate: Date;
  isWideVersion: boolean;
  onChange: (date: [Date | null, Date | null]) => void;
  onClick: () => void;
}

const DateFilterComponent = ({ startDate, endDate, isWideVersion, label = 'Filtrar por período', onChange, onClick }: DatepickerFilterProps) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <HStack spacing={3} mb={[6, 8]}>
      <Flex w={[200, 250]}>
        <StyledaDatepicker
            w={[200, 250]}
            h={[10, 12]}
            fontSize={["sm", "md"]}
            px={[2, 4]}
            borderRadius="0.375rem"
            bgColor={bgColor}
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
            placeholderText={label}
        />
      </Flex>

      { isWideVersion ? (
        <Button
          aria-label="Filter"
          bg="purple.500"
          _hover={{ bg: "purple.300" }}
          _active={{
            bg: "purple.400",
            transform: "scale(0.98)",
          }}
          leftIcon={<Icon as={RiFilter2Line} fontSize="16" />}
          onClick={onClick}
          
        >
          Filtrar
        </Button>
      ) : (
        <IconButton
          size="sm"
          aria-label="Filter"
          bg="purple.500"
          _hover={{ bg: "purple.300" }}
          _active={{
            bg: "purple.400",
            transform: "scale(0.98)",
          }}
          icon={<RiFilter2Line />} 
          onClick={onClick}
        />
      )}

        
    </HStack>
  )
}

export const DateFilter = memo(DateFilterComponent);