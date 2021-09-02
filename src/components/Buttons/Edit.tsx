import { memo } from "react"
import { Button, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { RiPencilLine } from "react-icons/ri"
import Link from "next/link"

interface EditButtonProps {
  href: string
}

const EditButtonComponent = ({ href }: EditButtonProps) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    isWideVersion 
    ? (
      <Link href={href}>
        <Button
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
      <Link href={href}>
        <IconButton
          size="sm"
          aria-label="Edit category"
          colorScheme="purple" 
          icon={<RiPencilLine />} 
        />
      </Link>
    )
  )
}

export const EditButton = memo(EditButtonComponent)