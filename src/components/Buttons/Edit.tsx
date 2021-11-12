import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";

interface EditButtonProps {
  isDisabled?: boolean;
  onClick: () => void;
}

const EditButtonComponent = ({ onClick, isDisabled = false }: EditButtonProps) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    isWideVersion 
    ? (
      <Button
        isDisabled={isDisabled}
        size="sm"
        fontSize="sm"
        bg="purple.500"
        _hover={{ bg: "purple.300" }}
        _active={{
          bg: "purple.400",
          transform: "scale(0.98)",
        }}
        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        onClick={onClick}
      >
        Editar
      </Button>
      )
    : (
      <IconButton
        isDisabled={isDisabled}
        size="xs"
        aria-label="Edit"
        bg="purple.500"
        _hover={{ bg: "purple.300" }}
        _active={{
          bg: "purple.400",
          transform: "scale(0.98)",
        }}
        icon={<RiPencilLine />}
        onClick={onClick}
      />
    )
  )
}

export const EditButton = memo(EditButtonComponent)