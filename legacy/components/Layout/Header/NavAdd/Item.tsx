import {
  Flex,
  LinkBox,
  LinkOverlay,
  Stack,
  useColorModeValue
} from "@chakra-ui/react";
import { ReactElement } from "react";

interface Props {
  label: string;
  icon: ReactElement
  onClick?: () => void;
}

export const NavAddItem = ({ icon, label, onClick }: Props) => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <LinkBox cursor={"pointer"}>      
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
    </LinkBox>
  )
}