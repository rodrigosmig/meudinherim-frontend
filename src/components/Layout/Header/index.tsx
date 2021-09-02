import { Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { NotificationsNav } from "./NotificationsNav";
import { Avatar } from './Avatar';
import { useSidebarDrawer } from "../../../contexts/SidebarDrawerContext";
import { RiMenuLine } from "react-icons/ri";
import { memo } from "react";

const HeaderComponent = () => {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    <Flex
      as="header"
      w="full"
      maxWidth={1480}
      mx="auto"
      mt="4"
      px="6"
      align="center"
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

      { isWideVersion && (
        <Logo />
      )}

      <Flex
        align={['center']}
        ml={['auto']}
      >
        <NotificationsNav />

        <Avatar showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  )
}

export const Header = memo(HeaderComponent);