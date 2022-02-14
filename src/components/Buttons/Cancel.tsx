import { 
  Button, 
  ButtonProps,
  useBreakpointValue
} from "@chakra-ui/react";

interface Props extends ButtonProps {
  label?: string;
}

export const CancelButton = ({ label = 'Cancelar', ...rest }: Props) => {
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