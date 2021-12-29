import {  
  Box,
  Stack,
  Text,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { ReactElement } from "react";
import { Link } from "../../Link";

interface NavAddItemProps {
  url: string;
  label: string;
  icon: ReactElement
}

export const NavAddItem = ({ icon, label, url }: NavAddItemProps) => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <NextLink href={url} passHref >
      <Link
        href=""
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: bg }}>
        <Stack direction={'row'}>
          <Flex
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            align={'center'}
            fontSize={['sm', "md", "md"]}
          >
            { icon }
          </Flex>

          <Flex
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            align={'center'}
            
            fontSize={['sm', "md", "md"]}
          >
            { label }
          </Flex>
        </Stack>
      </Link>
    </NextLink>
  )
}