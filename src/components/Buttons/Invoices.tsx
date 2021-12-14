import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { FaMoneyBillAlt } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";

interface InvoicesButtonProps {
  href: string
}

const invoicesButtonComponent = ({ href }: InvoicesButtonProps) => {
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
          leftIcon={<Icon as={HiOutlineDocumentDuplicate} fontSize="16" />}
        >
          Faturas
        </Button>
      
      </Link>
      )
    : (
      <Link href={href} passHref>
        <IconButton
          size="xs"
          aria-label="Invoices"
          bg="green.500"
          _hover={{ bg: "green.300" }}
          _active={{
            bg: "green.400",
            transform: "scale(0.98)",
          }}
          icon={<HiOutlineDocumentDuplicate />} 
        />
      </Link>
    )
  )
}

export const InvoicesButton = memo(invoicesButtonComponent)