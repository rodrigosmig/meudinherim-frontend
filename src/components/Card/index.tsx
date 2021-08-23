import { ReactElement } from "react"
import { 
	Box, 
	Flex, 
	Heading, 
} from "@chakra-ui/react"
import { AddButton } from "../Buttons/Add"

interface CardProps {
  title?: string;
  label?: string,
  button?: {
    onClick: () => void
  }
  children: ReactElement;
}

export const Card = ({ title, label, button, children }: CardProps) => {
	return (
		<Box flex='1' borderRadius={8} bg="gray.800" p="8">
      <Flex mb={[6, 6, 8]} justify="space-between" align="center">
        <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
          { title ?? '' }             
        </Heading>            

        <Heading fontSize={['lg', 'lg', 'xl']} fontWeight="normal">
          { label 
            ? label
            : button
              ? (
                <AddButton onClick={button.onClick} />
              )
              : ''
          }             
        </Heading>
      </Flex>
      
      {children}

    </Box>
	)
} 