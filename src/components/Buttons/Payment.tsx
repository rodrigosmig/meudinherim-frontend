import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiMoneyDollarBoxLine } from "react-icons/ri";

interface PaymentButtonProps {
  label?: string
  onClick: () => void;
}

const PaymentButtonComponent = ({ onClick, label = 'Pagar' }: PaymentButtonProps) => {
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
        bg="purple.500"
        _hover={{ bg: "purple.300" }}
        _active={{
          bg: "purple.400",
          transform: "scale(0.98)",
        }}
        leftIcon={<Icon as={RiMoneyDollarBoxLine} fontSize="16" />}
        onClick={onClick}
      >
        { label === 'Pagar' ? 'Pagar' : 'Receber' }
      </Button>
      )
    : (
      <IconButton
        size="xs"
        aria-label="Pay"
        bg="purple.500"
        _hover={{ bg: "purple.300" }}
        _active={{
          bg: "purple.400",
          transform: "scale(0.98)",
        }}
        icon={<RiMoneyDollarBoxLine />} 
        onClick={onClick}
      />
    )
  )
}

export const PaymentButton = memo(PaymentButtonComponent)