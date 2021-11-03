import { Flex, Icon } from "@chakra-ui/react";
import { RiCheckLine } from "react-icons/ri";

export const Check = () => {
  return (
    <Flex justify="center">
      <Icon as={RiCheckLine} fontSize="16" color="blue.600" />
    </Flex>
  )
}