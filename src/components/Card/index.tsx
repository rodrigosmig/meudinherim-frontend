import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CardProps extends BoxProps  {
  children: ReactNode
}

export const Card = ({ children, ...rest }: CardProps) => {
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