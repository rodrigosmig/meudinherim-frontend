import { Button, ButtonProps } from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label: string
}

export function SubmitButton({ label, ...rest }: SubmitButtonProps) {
  return (
    <Button
      type="submit" 
      colorScheme="pink" 
      size="lg"
      {...rest}
    >
      {label}
    </Button>
  )
}