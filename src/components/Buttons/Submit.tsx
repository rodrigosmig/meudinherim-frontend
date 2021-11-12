import { Button, ButtonProps } from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label: string
}

export const SubmitButton = ({ label, ...rest }: SubmitButtonProps) => {
  return (
    <Button
      type="submit" 
      bg="pink.500"
      _hover={{ bg: "pink.600" }}
      _active={{
        bg: "pink.400",
        transform: "scale(0.98)",
      }}
      {...rest}
    >
      {label}
    </Button>
  )
}