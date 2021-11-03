import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";
import Link from "next/link";
interface EditButtonProps {
  href: string
  isDisabled?: boolean
}

const EditButtonComponent = ({ href, isDisabled = false }: EditButtonProps) => {
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
          isDisabled={isDisabled}
          size="sm"
          fontSize="sm"
          colorScheme="purple"
          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        >
          Editar
        </Button>
      
      </Link>
      )
    : (
      <Link href={href} passHref>
        <IconButton
          isDisabled={isDisabled}
          size="xs"
          aria-label="Edit"
          colorScheme="purple" 
          icon={<RiPencilLine />} 
        />
      </Link>
    )
  )
}

export const EditButton = memo(EditButtonComponent)