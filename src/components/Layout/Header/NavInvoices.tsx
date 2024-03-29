import {  
  Box,
  Center,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
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
import { FaCreditCard } from 'react-icons/fa';
import { useOpenInvoices } from "../../../hooks/useOpenInvoices";
import { Loading } from "../../Loading";
import NextLink from 'next/link'
import { Fragment, useEffect, useState } from "react";
import { IInvoice } from "../../../types/card";

interface IInvoiceData extends Omit<IInvoice, 'amount'> {
  amount: string;
}

export const NavInvoices = () => {
  const [invoices, setInvoices] = useState([] as IInvoiceData[]);
  const [total, setTotal] = useState("");
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const { data, isLoading, isFetching } = useOpenInvoices();

  useEffect(() => {
    if (data) {
      setInvoices(data.invoices)
      setTotal(data.total)
    }
  }, [data])

  return (
    <Box>
      <Popover 
        isLazy 
        trigger={'hover'}
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
          width={['full', 'xs']}
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
              <Loading mb={4} />
            ) : (
              <>
                <PopoverBody>
                  { invoices.map(invoice => (
                    <Fragment key={invoice.id}>
                      <LinkBox>
                        <NextLink href={`/cards/${invoice.card.id}/invoices/${invoice.id}/entries`} passHref  key={invoice.id}>
                          <LinkOverlay 
                            role={'group'}
                            display={'block'}
                            p={2}
                            rounded={'md'}
                            _hover={{ bg: bgColor }}>
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
                          </LinkOverlay>
                        </NextLink>
                      
                      </LinkBox>

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
                      { total }
                    </Text>
                  </Box>
                </PopoverFooter>
              </>
            )}
        </PopoverContent>
      </Popover>
    </Box>
  )
}