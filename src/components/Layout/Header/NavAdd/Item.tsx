import {  
  Flex,
  LinkBox,
  LinkOverlay,
  Stack,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { ReactElement } from "react";

interface Props {
  url: string;
  label: string;
  icon: ReactElement
  onClick?: () => void;
}

export const NavAddItem = ({ icon, label, url, onClick }: Props) => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <LinkBox>
      <NextLink href={url} passHref >
        <LinkOverlay
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: bg }}
          onClick={onClick}
        >
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
        </LinkOverlay>
      </NextLink>    
    </LinkBox>
  )
}