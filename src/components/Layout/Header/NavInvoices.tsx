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
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { FaCreditCard } from 'react-icons/fa'
import { useOpenInvoices } from "../../../hooks/useOpenInvoices";
import { Loading } from "../../Loading";
import Link from 'next/link'
import { Fragment } from "react";

export const NavInvoices = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const { data, isLoading, isFetching, refetch } = useOpenInvoices();

  return (
    <Popover 
      isLazy 
      trigger={'hover'}
      onOpen={refetch}
    >
      <PopoverTrigger>
        <IconButton
          aria-label="add menu"
          size="sm"
          variant="ghost"
          icon={<Icon as={FaCreditCard} fontSize={[18, 20, 20]} />}
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
          <Center>
            Faturas { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Center>
        </PopoverHeader>
          { isLoading ? (
            <Loading />
          ) : (
            <>
              <PopoverBody>
                { data.invoices.map(invoice => (
                  <Fragment key={invoice.id}>
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
                              fontSize={['sm', "md", "md"]}
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
                            fontSize={['sm', "md", "md"]}
                          >
                            { invoice.amount }
                          </Flex>
                        </Stack>
                      </ChakraLink>
                    </Link>

                    <Divider mt={2} mb={2} />
                  </Fragment>
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