import { HStack, Icon } from "@chakra-ui/react";
import { RiNotificationLine, RiAddCircleLine } from "react-icons/ri";

export const NotificationsNav = ()  => {
  return (
    <HStack 
      spacing={["6", "6", "8"]}
      mx={["6", "6", "8"]}
      pr={["6", "6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon as={RiNotificationLine} fontSize="20" />
      <Icon as={RiAddCircleLine} fontSize="20" />
    </HStack>
  )
}