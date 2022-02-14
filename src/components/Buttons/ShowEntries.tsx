import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface Props {
  onClick: () => void;
}

const ShowEntriesButtonComponent = ({ onClick, ...rest }: Props) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  return (
    isWideVersion 
    ? (
      <Button
        bg="green.500"
        _hover={{ bg: "green.400" }}
        _active={{
          bg: "green.300",
          transform: "scale(0.98)",
        }}
        variant="outline"
        leftIcon={<Icon as={AiOutlineShoppingCart} fontSize="16" />}
        onClick={onClick}
        {...rest}
      >
        Lançamentos
      </Button>
      )
    : (
      <IconButton
        size="xs"
        aria-label={`Show Entries`}
        bg="green.500"
        _hover={{ bg: "green.400" }}
        _active={{
          bg: "green.300",
          transform: "scale(0.98)",
        }}
        icon={<AiOutlineShoppingCart />} 
        onClick={onClick}
      />
    )
  )
}

export const ShowEntriesButton = memo(ShowEntriesButtonComponent)