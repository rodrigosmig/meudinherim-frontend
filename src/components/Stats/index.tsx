import { 
  Box, 
  Flex, 
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue
} from '@chakra-ui/react';
import { toCurrency } from '../../utils/helpers';
import { IconType } from 'react-icons';

interface Props {
  label: string;
  amount: number;
  color: string;
  icon: IconType
}

export const Stats = ({ label, amount, color, icon }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  return (
    <Flex
      w={"full"}
      p="4"
      mb={2}
      bg={bgColor}
      borderRadius={8}
      boxShadow={'lg'}
      justifyContent={'center'}
      alignItems={'center'}
    >     
      <Flex
        w={['4rem', '4.5rem']}
        h={[14, 16]}
        justifyContent={'center'}
        alignItems={'center'}
        borderRadius={4}
        bgColor={color}
        textAlign={'center'}
      >
        <Icon as={icon}
          fontSize={["4xl"]}
          color={"white"}
        />
      </Flex>

      <Stat ml={2}>
        <StatLabel>{ label }</StatLabel>
        <StatNumber fontSize={[20]}>{ toCurrency(amount) }</StatNumber>
      </Stat>
    </Flex>
  )
}