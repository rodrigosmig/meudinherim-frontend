import { memo } from "react";
import { 
  Button, 
  ButtonProps,
  Icon,
  IconButton,
  useBreakpointValue
} from "@chakra-ui/react";
import { MdPayment } from "react-icons/md";

interface SubmitButtonProps extends ButtonProps {
  label: string;
}

export const ShowPaymentButtonComponent = ({ label, ...rest }: SubmitButtonProps) => {
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
          leftIcon={<Icon as={MdPayment} fontSize="16" />}
          {...rest}
        >
          { label }
        </Button>
      )
    : (
      <IconButton
        size="xs"
        aria-label={`Show ${label}`}
        bg="green.500"
        _hover={{ bg: "green.400" }}
        _active={{
          bg: "green.300",
          transform: "scale(0.98)",
        }}
        icon={<MdPayment />}
        {...rest}
      />
    )
  )
}

export const ShowPaymentButton = memo(ShowPaymentButtonComponent)