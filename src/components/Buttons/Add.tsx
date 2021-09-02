import { Button, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { memo } from "react"
import { RiAddLine } from "react-icons/ri"

interface AddButtonProps {
  onClick: () => void
}

const AddButtonComponent = ({ onClick }: AddButtonProps) => {
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
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
        onClick={onClick}
      >
        Adicionar
      </Button>
      )
    : (
      <Tooltip label="Adicionar" aria-label="A tooltip">
        <IconButton
          size="sm"
          aria-label="Add category"
          colorScheme="pink" 
          icon={<RiAddLine />} 
          onClick={onClick}
        />
      </Tooltip>
    )
  )
}

export const AddButton = memo(AddButtonComponent);