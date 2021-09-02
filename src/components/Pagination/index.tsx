import { Box, Button, Stack, Text, Tooltip } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  from: number,
  to: number,
  lastPage: number,
  totalRegisters: number;
  currentPage?: number;
  onPageChange: (page: number) => void
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)].map((_, index) => {
    return from + index + 1
  })
  .filter(page => page > 0)
}

export const Pagination = ({
  from,
  to,
  lastPage,
  totalRegisters,
  currentPage = 1,
  onPageChange,
}: PaginationProps ) => {
  const previousPages = currentPage > 1
    ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
    : [];
  
  const nextPages = currentPage < lastPage
    ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
    : [];
    
  return (
    <Stack 
      direction={['column', "row"]}
      spacing="6"
      mt="8"
      justify="space-between"
      align="center"
    >      
      <Box>
        <strong>{from}</strong> - <strong>{to}</strong> de <strong>{totalRegisters}</strong>
      </Box>
      
      <Stack direction="row" spacing="2">
        <Tooltip label="Anterior" aria-label="previous">
          <Button
            size="sm"
            fontSize="xs"
            w="4"
            bg="gray.700"
            _hover={{
              bg: "gray.500"
            }}
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            { '<' }
          </Button>
        </Tooltip>

        {currentPage > (1 + siblingsCount) && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            { currentPage > (2 + siblingsCount) && (
              <Text color='gray.300' width="8" textAlign='center'>...</Text>
            ) }
          </>
        )}
        
        {previousPages.length > 0 && previousPages.map(page => {
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        <PaginationItem onPageChange={onPageChange} number={currentPage} isCurrent />

        {nextPages.length > 0 && nextPages.map(page => {
          return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
        })}

        {currentPage + siblingsCount < lastPage && (
          <>
            { (currentPage + 1 + siblingsCount)  < lastPage && (
              <Text color='gray.300' width="8" textAlign='center'>...</Text>
            ) }
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>  
        )}

        <Tooltip label="Próximo" aria-label="next">
          <Button
            size="sm"
            fontSize="xs"
            w="4"
            bg="gray.700"
            _hover={{
              bg: "gray.500"
            }}
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === lastPage}
          >
            { '>' }
          </Button>
        </Tooltip>

        

      </Stack>
      
    </Stack>
  )
}