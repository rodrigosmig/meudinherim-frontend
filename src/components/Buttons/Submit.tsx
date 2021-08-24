import { Button, ButtonProps } from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label: string
}

export const SubmitButton = ({ label, ...rest }: SubmitButtonProps) => {
  return (
    <Button
      type="submit" 
      colorScheme="pink" 
      {...rest}
    >
      {label}
    </Button>
  )
}