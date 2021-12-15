import { 
  Button, 
  ButtonProps,
  useBreakpointValue
} from "@chakra-ui/react";

interface SubmitButtonProps extends ButtonProps {
  label?: string;
}

export const CancelButton = ({ label = 'Cancelar', ...rest }: SubmitButtonProps) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const size = isWideVersion ? 'md' : 'sm';

  return (
    <Button
      size={size}
      variant="outline"
      {...rest}
    >
      { label }
    </Button>
  )
}