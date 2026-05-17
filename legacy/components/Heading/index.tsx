import { ReactNode } from "react"
import { 
	Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps
} from "@chakra-ui/react";

interface Props extends ChakraHeadingProps {
  children: ReactNode;
}

export const Heading = ({ children, ...rest }: Props) => {
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