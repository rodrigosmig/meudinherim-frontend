import { ReactNode } from "react";
import { 
  Box, 
  Stack, 
  Text, 
  useColorModeValue 
} from "@chakra-ui/react";

interface NavSectionProps {
  title: string;
  children: ReactNode;
}

export const NavSection = ({ title, children }: NavSectionProps) => {
  const color = useColorModeValue('gray.900', 'gray.50')

  return (
    <Box>
      <Text fontWeight="bold" color={color} fontSize="small">{title}</Text>
      <Stack spacing="4" mt="4" align="stretch">
        {children}
      </Stack>
    </Box>
  )
}