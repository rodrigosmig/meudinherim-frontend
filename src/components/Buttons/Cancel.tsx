import { Button, ButtonProps } from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label?: string;
}

export const CancelButton = ({ label = 'Cancelar', ...rest }: SubmitButtonProps) => {
  return (
    <Button
      variant="outline"
      {...rest}
    >
      { label }
    </Button>
  )
}