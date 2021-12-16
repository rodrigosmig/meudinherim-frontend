import {  
  Box,
  Link as ChakraLink,
  Stack,
  Text,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import Link from 'next/link';
import { ReactElement } from "react";

interface NavAddItemProps {
  url: string;
  label: string;
  icon: ReactElement
}

export const NavAddItem = ({ icon, label, url }: NavAddItemProps) => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <Link href={url} passHref >
      <ChakraLink 
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: bg }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'pink.400' }}
              fontWeight={500}
              fontSize={['sm', "md", "md"]}
            >
              { icon }
            </Text>
          </Box>
          <Flex
            _groupHover={{ color: 'pink.400' }}
            
            align={'center'}
            flex={1}
            fontSize={['sm', "md", "md"]}
          >
            { label }
          </Flex>
        </Stack>
      </ChakraLink>
    </Link>
  )
}