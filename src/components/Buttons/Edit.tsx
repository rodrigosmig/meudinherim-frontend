import { Button, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { RiPencilLine } from "react-icons/ri"

interface EditButtonProps {
  onClick: () => void
}

export const EditButton = ({ onClick }: EditButtonProps) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    isWideVersion 
    ? (
      <Button
        size="sm"
        fontSize="sm"
        colorScheme="purple"
        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        onClick={onClick}
      >
        Editar
      </Button>
      )
    : (
      <Tooltip label="Editar" aria-label="A tooltip">
        <IconButton
          size="sm"
          aria-label="Edit category"
          colorScheme="purple" 
          icon={<RiPencilLine />} 
          onClick={onClick}
        />
      </Tooltip>
    )
  )
}