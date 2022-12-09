import {
  Box,
  Flex, Text,
  useColorModeValue
} from '@chakra-ui/react';
import { Loading } from '../Loading';

interface Props {
  label: string;
  color: string;
}

export const LoadingDonutChart = ({ label, color }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      flexDir={'column'}
      w={"full"}
      mb={2}
      bg={bgColor}
      borderBottomRadius={8}
      boxShadow={'xl'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box bgColor={color} w="100%">
        <Text
          w="full"
          p={3}
          color={"white"} 
          fontWeight={'bold'}
          fontSize={'lg'}
        >
          { label }
        </Text>
      </Box> 
      <Flex
        h={['12.5rem', 'xs']}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Loading />
        
      </Flex>
    </Flex>
  )
}