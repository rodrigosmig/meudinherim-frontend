import { 
  Box,
  HStack, 
  Icon,
} from "@chakra-ui/react";
import { RiNotificationLine } from "react-icons/ri";
import { NavAdd } from "./NavAdd";
import { NavBalance } from "./NavBalance";
import { ChangeTheme } from "./ChangeTheme";
import { NavInvoices } from "./NavInvoices";

export const MenuNav = ()  => {
  return (
    <HStack spacing={2}
      mx={["4", "4", "6"]}
      pr={["4", "4", "6"]}
      borderRightWidth={1}
    >
      <ChangeTheme />
      
      <Box as="a">
      <Icon as={RiNotificationLine} fontSize="20" />

      </Box>
      
      
      <NavAdd />
      <NavBalance />
      <NavInvoices />
      
    </HStack>
  )
}