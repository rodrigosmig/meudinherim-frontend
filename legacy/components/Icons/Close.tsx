import { Flex, Icon } from "@chakra-ui/react";
import { RiCloseFill } from "react-icons/ri";

export const Close = () => {
  return (
    <Flex justify={["center", "flex-start"]}>
      <Icon as={RiCloseFill} fontSize="16" color="red.600" />
    </Flex>
  )
}