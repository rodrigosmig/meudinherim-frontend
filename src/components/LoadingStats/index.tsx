import {
  Flex, Stat,
  StatLabel,
  StatNumber,
  useColorModeValue
} from '@chakra-ui/react';
import { Loading } from '../Loading';

interface Props {
  color: string;
}

export const LoadingStats = ({ color }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.800');

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
        <Loading mt={0}/>
      </Flex>

      <Stat ml={2}>
        <StatLabel></StatLabel>
        <StatNumber fontSize={[20]}>Loading...</StatNumber>
      </Stat>
      
    </Flex>
  )
}