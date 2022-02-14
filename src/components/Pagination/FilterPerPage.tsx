import { ChangeEvent, memo } from 'react';
import { Box, Flex, Select } from "@chakra-ui/react";

interface Props {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  isWideVersion: boolean;
}

export const FilterPerPage = ({ onChange, isWideVersion }: Props) => {
  return (
    <Flex align="center">
      <Select
        variant="unstyled"
        w={[14]}
        onChange={event => onChange(event)}
        
        size="sm"
      >
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </Select>
      { isWideVersion && (
        <Box fontSize={['sm']}>Resultados por página</Box>
      ) }
    </Flex>
  )
}