import { 
  HStack, 
  Icon,
} from "@chakra-ui/react";
import { RiNotificationLine } from "react-icons/ri";
import { NavAdd } from "./NavAdd";
import { NavBalance } from "./NavBalance";

export const MenuNav = ()  => {
  return (
    <HStack 
      spacing={["4", "4", "6"]}
      mx={["6", "6", "8"]}
      pr={["6", "6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon as={RiNotificationLine} fontSize="20" />
      <NavAdd />
      <NavBalance />
      
    </HStack>
  )
}