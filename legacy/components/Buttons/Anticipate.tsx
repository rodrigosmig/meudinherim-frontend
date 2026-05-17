import { 
  Button, 
  ButtonProps,
  useBreakpointValue
} from "@chakra-ui/react";

interface Props extends ButtonProps {
  onClick: () => void;
}

export const AnticipateButton = ({ onClick, ...rest }: Props) => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const size = isWideVersion ? 'md' : 'sm';

  return (
    <Button
      size={size}
      type="submit" 
      bg="pink.500"
      _hover={{ bg: "pink.600" }}
      _active={{
        bg: "pink.400",
        transform: "scale(0.98)",
      }}
      onClick={onClick}
      {...rest}
    >
      Antecipar
    </Button>
  )
}