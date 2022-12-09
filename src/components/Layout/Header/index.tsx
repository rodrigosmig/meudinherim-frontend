import {
  Flex,
  Icon,
  IconButton,
  useBreakpointValue
} from "@chakra-ui/react";
import { memo } from "react";
import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../../contexts/SidebarDrawerContext";
import { Avatar } from './Avatar';
import { MenuNav } from "./MenuNav";

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