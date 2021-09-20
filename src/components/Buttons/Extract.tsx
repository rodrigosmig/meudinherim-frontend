import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { FaMoneyBillAlt } from "react-icons/fa";

interface ExtractButtonProps {
  href: string
}

const ExtractButtonComponent = ({ href }: ExtractButtonProps) => {
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
          colorScheme="purple"
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
          colorScheme="purple" 
          icon={<FaMoneyBillAlt />} 
        />
      </Link>
    )
  )
}

export const ExtractButton = memo(ExtractButtonComponent)