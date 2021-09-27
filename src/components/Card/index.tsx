import { ReactElement } from "react"
import { 
	Box, 
} from "@chakra-ui/react"
interface CardProps {
  children: ReactElement;
}

export const Card = ({ children }: CardProps) => {
	return (
		<Box 
      w={"full"}
      flex='1' 
      borderRadius={8} 
      bg="gray.800" p="8" 
      h="max-content"
      mb={[4]}
    >     
      {children}

    </Box>
	)
} 