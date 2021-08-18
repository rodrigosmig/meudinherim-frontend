import { ElementType } from "react";
import { ActiveLink } from './ActiveLink';
import { 
  Icon, 
  Link as ChakraLink, 
  Text, 
  LinkProps as ChakraLinkProps 
} from "@chakra-ui/react";

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export const NavLink = ({ icon, children, href, ...rest }: NavLinkProps) => {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">{children}</Text>
      </ChakraLink>    
    </ActiveLink>
  )
}