import { Button, ButtonProps, useBreakpointValue } from "@chakra-ui/react";

interface Props extends ButtonProps {
  label: string
}

export const SubmitButton = ({ label, ...rest }: Props) => {
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
      {...rest}
    >
      {label}
    </Button>
  )
}