import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends BoxProps  {
  children: ReactNode
}

export const Card = ({ children, ...rest }: Props) => {
  const bgCard = useColorModeValue('white', 'gray.800');
  return (
    <Box
      bg={bgCard}
      w={"full"}
      borderRadius={8}
      p="8" 
      h="max-content"
      {...rest}
    >     
      {children}
    </Box>
  )
}