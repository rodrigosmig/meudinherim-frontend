import { 
  Button, 
  Icon, 
  IconButton, 
  Tooltip, 
  useBreakpointValue, 
  useColorModeValue 
} from "@chakra-ui/react"
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
        variant="outline"
        bg="pink.500"
        _hover={{ bg: "pink.300" }}
        _active={{
          bg: "pink.400",
          transform: "scale(0.98)",
        }}
        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
        onClick={onClick}
      >
        Adicionar
      </Button>
      )
    : (
      <Tooltip label="Adicionar" aria-label="A tooltip">
        <IconButton
          size="xs"
          aria-label="Add"
          colorScheme="pink" 
          icon={<RiAddLine />} 
          onClick={onClick}
        />
      </Tooltip>
    )
  )
}

export const AddButton = memo(AddButtonComponent);