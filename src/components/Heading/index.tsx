import { ReactNode } from "react"
import { 
	Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps
} from "@chakra-ui/react";

interface HeadingProps extends ChakraHeadingProps {
  children: ReactNode;
}

export const Heading = ({ children, ...rest }: HeadingProps) => {
	return (
		<ChakraHeading 
      fontSize={['md', '2xl']} 
      fontWeight="normal"
      {...rest}
    >
      { children }
    </ChakraHeading>
	)
} 