import { 
  Box, 
  Flex, 
  Icon, 
  IconButton, 
  useBreakpointValue, 
  useColorModeValue 
} from "@chakra-ui/react";
import { MenuNav } from "./MenuNav";
import { Avatar } from './Avatar';
import { useSidebarDrawer } from "../../../contexts/SidebarDrawerContext";
import { RiMenuLine } from "react-icons/ri";
import { memo } from "react";

const HeaderComponent = () => {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true 
  })

  return (
    <Flex
      ml={{ base: 0, md: 0 }}
      px={{ base: 4, md: 4 }}
      h={[20]}
      alignItems="center"
    >
      { !isWideVersion && (
        <IconButton
          aria-label="Open Navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        />
      )}

      <Flex
        align={['center']}
        ml={['auto']}
      >
        <MenuNav />

        <Avatar />
      </Flex>
    </Flex>
  )
}

export const Header = memo(HeaderComponent);