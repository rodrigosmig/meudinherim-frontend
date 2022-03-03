
import { ReactNode } from "react";
import NextLink from "next/link";
import { Box } from "@chakra-ui/react";

interface Props {
  href: string;
  children: ReactNode;
  passHref?: boolean;
}
export const Link = ({ href, children, passHref = false }: Props) => {
  return (
    <NextLink href={href} passHref>
      <Box as="a"
        _hover={{
          cursor: 'pointer',
          color: 'pink.400'
        }}
      >
        { children }
      </Box>
    </NextLink>
  )
}