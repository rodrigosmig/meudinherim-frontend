import { Link as ChakraLink, LinkProps as ChakraLinkPros } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, ReactElement } from "react";

interface LinkProps extends ChakraLinkPros {
  href?: string;
  children: ReactElement
}
export const NavLinkBase: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = ({ href, children, ...rest }, ref) => {
  return (
    <ChakraLink
      href={href}
      ref={ref}
      {...rest}
    >
      { children }
    </ChakraLink>
  )
}

export const Link = forwardRef(NavLinkBase);