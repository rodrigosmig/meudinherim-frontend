import { 
  HStack, 
  Icon,
} from "@chakra-ui/react";
import { RiNotificationLine } from "react-icons/ri";
import { NavAdd } from "./NavAdd";
import { NavBalance } from "./NavBalance";
import { ChangeTheme } from "./ChangeTheme";

export const MenuNav = ()  => {
  return (
    <HStack 
      spacing={["4", "4", "6"]}
      mx={["6", "6", "8"]}
      pr={["6", "6", "8"]}
      py="1"      
      borderRightWidth={1}
    >
      <ChangeTheme />
      <Icon as={RiNotificationLine} fontSize="20" />
      <NavAdd />
      <NavBalance />
      
    </HStack>
  )
}