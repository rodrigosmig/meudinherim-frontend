import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { FaMoneyBillAlt } from "react-icons/fa";

interface Props {
  href: string
}

const ExtractButtonComponent = ({ href }: Props) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    isWideVersion 
    ? (
      <Link href={href} passHref>
        <Button
          size="sm"
          fontSize="sm"
          bg="green.500"
          _hover={{ bg: "green.300" }}
          _active={{
            bg: "green.400",
            transform: "scale(0.98)",
          }}
          leftIcon={<Icon as={FaMoneyBillAlt} fontSize="16" />}
        >
          Extrato
        </Button>
      
      </Link>
      )
    : (
      <Link href={href} passHref>
        <IconButton
          size="xs"
          aria-label="Extract"
          bg="green.500"
          _hover={{ bg: "green.300" }}
          _active={{
            bg: "green.400",
            transform: "scale(0.98)",
          }}
          icon={<FaMoneyBillAlt />} 
        />
      </Link>
    )
  )
}

export const ExtractButton = memo(ExtractButtonComponent)