import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";
import Link from "next/link";
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
        colorScheme="purple"
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
        colorScheme="purple" 
        icon={<RiPencilLine />}
        onClick={onClick}
      />
    )
  )
}

export const EditButton = memo(EditButtonComponent)