import { memo } from "react";
import { Button, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiMoneyDollarBoxLine } from "react-icons/ri";

interface Props {
  label?: string
  onClick: () => void;
}

const ParcialPaymentComponent = ({ onClick, label = 'Pagar' }: Props) => {
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
        bg="green.500"
        _hover={{ bg: "green.300" }}
        _active={{
          bg: "green.400",
          transform: "scale(0.98)",
        }}
        leftIcon={<Icon as={RiMoneyDollarBoxLine} fontSize="16" />}
        onClick={onClick}
      >
        { label ? label : 'Pagar' }
      </Button>
      )
    : (
      <IconButton
        size="xs"
        aria-label="Pay"
        bg="green.500"
        _hover={{ bg: "green.300" }}
        _active={{
          bg: "green.400",
          transform: "scale(0.98)",
        }}
        icon={<RiMoneyDollarBoxLine />} 
        onClick={onClick}
      />
    )
  )
}

export const ParcialPayment = memo(ParcialPaymentComponent)