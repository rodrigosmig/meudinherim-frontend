import { Button, ButtonProps } from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label: string;
}

export const ShowPaymentButton = ({ label, ...rest }: SubmitButtonProps) => {
  return (
    <Button
      bg="green.500"
      _hover={{ bg: "green.400" }}
      _active={{
        bg: "green.300",
        transform: "scale(0.98)",
      }}
      variant="outline"
      {...rest}
    >
      { label }
    </Button>
  )
}