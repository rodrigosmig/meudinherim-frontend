import { ReactElement } from "react"
import { 
	Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps
} from "@chakra-ui/react";

interface CardProps extends ChakraHeadingProps {
  children: ReactElement;
}

export const Heading = ({ children }: CardProps) => {
	return (
		<ChakraHeading fontSize={['md', '2xl']} fontWeight="normal">
      { children }
    </ChakraHeading>
	)
} 