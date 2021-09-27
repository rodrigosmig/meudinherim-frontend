import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";
import { RiMoneyDollarBoxLine } from "react-icons/ri";

interface PaymentButtonProps {
  onClick: () => void;
}

const PaymentButtonComponent = ({ onClick }: PaymentButtonProps) => {
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
        leftIcon={<Icon as={RiMoneyDollarBoxLine} fontSize="16" />}
        onClick={onClick}
      >
        Pagar
      </Button>
      )
    : (
      <IconButton
        size="xs"
        aria-label="Pay"
        colorScheme="purple" 
        icon={<RiMoneyDollarBoxLine />} 
        onClick={onClick}
      />
    )
  )
}

export const PaymentButton = memo(PaymentButtonComponent)