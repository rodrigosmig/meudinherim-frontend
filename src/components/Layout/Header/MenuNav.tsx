import { 
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
    <HStack 
      mx={["4", "4", "6"]}
      pr={["4", "4", "6"]}
      borderRightWidth={1}
    >
      <ChangeTheme />
      <Icon as={RiNotificationLine} fontSize="20" />
      <NavAdd />
      <NavBalance />
      <NavInvoices />
      
    </HStack>
  )
}