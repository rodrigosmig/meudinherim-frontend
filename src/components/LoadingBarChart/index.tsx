import { 
  Box, 
  Flex, 
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { Loading } from '../Loading';

interface LoadingBarChartProps {
  label: string;
}

export const LoadingBarChart = ({ label }: LoadingBarChartProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      flexDir={'column'}
      borderBottomRadius={8}
      boxShadow={'xl'}
      justifyContent={'center'}
      alignItems={'center'}
      bg={bgColor}
    >
      <Box w="100%">
        <Text
          w="full"
          p={3}
          fontWeight={'bold'}
          fontSize={['md', 'lg']}
          textAlign="center"
        >
          { label }
        </Text>
      </Box> 
      <Flex
        w={['16.5rem', '30rem']}
        h={['12.5rem', 'xs']}
        justifyContent={'center'}
        alignItems={'center'}
        mb={4}
      >
        <Loading />     
      </Flex>
    </Flex>
  )
}