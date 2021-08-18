import { ReactElement } from "react"
import { 
	Box, 
	Flex, 
	Heading 
} from "@chakra-ui/react"

interface CardProps {
  title?: string;
  options?: string;
  children: ReactElement;
}

export const Card = ({ title, options, children }: CardProps) => {
	return (
		<Box flex='1' borderRadius={8} bg="gray.800" p="8">
      <Flex mb={[6, 6, 8]} justify="space-between" align="center">
        <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
          { title ?? '' }             
        </Heading>            

        <Heading size="lg" fontWeight="normal">
          { options ?? '' }             
        </Heading>
      </Flex>
      
      {children}

    </Box>
	)
} 