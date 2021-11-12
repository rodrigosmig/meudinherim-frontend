import { 
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page:number) => void;
}

export function PaginationItem({ number, isCurrent = false, onPageChange }: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        w="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bg: 'pink.500',
          cursor: 'default'
        }}
      >
        { number }
      </Button>
    );

  }
  
  return (
    <Button
      size="sm"
      fontSize="xs"
      w="4"
      bg={useColorModeValue('gray.300', 'gray.700')}
      _hover={{
        bg:useColorModeValue('gray.200', 'gray.500')
      }}
      onClick={() => onPageChange(number)}

    >
      { number }
    </Button>
  )
}