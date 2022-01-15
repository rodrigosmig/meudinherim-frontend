import { 
  Box,
  HStack, 
  Icon,
} from "@chakra-ui/react";
import { NavAdd } from "./NavAdd";
import { NavBalance } from "./NavBalance";
import { ChangeTheme } from "./ChangeTheme";
import { NavInvoices } from "./NavInvoices";
import { NavNotifications } from "./NavNotifications";

export const MenuNav = ()  => {
  return (
    <HStack spacing={2}
      mx={["4", "4", "6"]}
      pr={["4", "4", "6"]}
      borderRightWidth={1}
    >
      <ChangeTheme />
      <NavNotifications />
      <NavAdd />
      <NavBalance />
      <NavInvoices />
      
    </HStack>
  )
}