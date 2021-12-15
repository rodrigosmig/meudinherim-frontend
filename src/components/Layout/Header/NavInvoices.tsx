import {  
  Box,
  Center,
  Flex,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiBankCard2Line } from "react-icons/ri";
import { useOpenInvoices } from "../../../hooks/useOpenInvoices";
import { Loading } from "../../Loading";
import Link from 'next/link'

export const NavInvoices = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const { data, isLoading, isFetching, refetch } = useOpenInvoices();

  return (
    <Popover isLazy trigger={'hover'}>
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Open Invoices"
          icon={<Icon as={RiBankCard2Line} fontSize={[18, 20, 20]} />}
        />
      </PopoverTrigger>
      <PopoverContent
        border={0}
        boxShadow={'xl'}
        rounded={'xl'}
        minW={['xs', 'sm']}
      >
        <PopoverArrow />
        <PopoverHeader 
          fontWeight="bold" 
          fontSize={['sm', "lg", "lg"]}
        >
          <Center>Faturas</Center>
        </PopoverHeader>
          { isLoading ? (
            <Loading />
          ) : (
            <>
              <PopoverBody>
                { data.invoices.map(invoice => (
                  <Link href={`/cards/${invoice.card.id}/invoices/${invoice.id}/entries`} passHref  key={invoice.id}>
                    <ChakraLink 
                      role={'group'}
                      display={'block'}
                      p={2}
                      rounded={'md'}
                      _hover={{ bg: bg }}>
                      <Stack direction={'row'} align={'center'}>
                        <Box>
                          <Text
                            transition={'all .3s ease'}
                            _groupHover={{ color: 'pink.400' }}
                            fontWeight={500}
                            fontSize={['sm', "lg", "lg"]}
                          >
                            { invoice.card.name }
                          </Text>
                          <Text fontSize={['xs', "md", "md"]}>Vencimento: { invoice.due_date }</Text>
                        </Box>
                        <Flex
                          _groupHover={{ color: 'pink.400' }}
                          justify={'flex-end'}
                          align={'center'}
                          flex={1}
                          fontSize={['sm', "lg", "lg"]}
                        >
                          { invoice.amount }
                        </Flex>
                      </Stack>
                    </ChakraLink>
                  </Link>
                ))}
              </PopoverBody>

              <PopoverFooter
                border='0'
                d='flex'
                alignItems='center'
                justifyContent='center'
                pb={4}
              >
                <Box fontSize={['sm', "md", "md"]}>
                  <Text as="span" fontWeight="bold" mr="1">
                    Total:
                  </Text>
                  <Text as="span" color="red.500">
                    {data.total }
                  </Text>
                </Box>
              </PopoverFooter>
            </>
          )}
      </PopoverContent>
    </Popover>
  )
}