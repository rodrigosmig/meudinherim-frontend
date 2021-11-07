import { useSidebarDrawer } from "../../../contexts/SidebarDrawerContext";
import { SidebarNav } from './SidebarNav';
import { 
  Box,
  Drawer, 
  DrawerBody, 
  DrawerCloseButton, 
  DrawerContent, 
  DrawerHeader, 
  DrawerOverlay,
  Flex,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { memo } from "react";
import { Logo } from "../Logo";

const SidebarComponent = () => {
  const { isOpen, onClose } = useSidebarDrawer();

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false
  });

  if (isDrawerSidebar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bg="gray.800" p="4">
          <DrawerCloseButton mt="6" />
          <DrawerHeader><Logo /></DrawerHeader>
          <DrawerBody>
            <SidebarNav />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
    )
  }

  return (
    <Box
      pos="fixed"
      h="full"
      w={{ base: 'full', md: 60 }}
      overflowY="auto"
    >
      <Flex h="20" alignItems="center" justifyContent="space-between">
        <Logo />
      </Flex>

      <SidebarNav />
    </Box>
  )
}

export const Sidebar = memo(SidebarComponent);