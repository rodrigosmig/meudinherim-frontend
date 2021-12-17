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
  Spinner,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { Fragment } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { Loading } from "../../Loading";

export const NavBalance = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const { data, isLoading, isFetching, refetch } = useAccountBalance(null);

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
          icon={<Icon as={HiOutlineCurrencyDollar} fontSize={[18, 20, 20]} />}
        />
      </PopoverTrigger>
      <PopoverContent
        border={0}
        boxShadow={'xl'}
        rounded={'xl'}
      >
        <PopoverArrow />
        <PopoverHeader 
          fontWeight="bold" 
          fontSize={['sm', "lg", "lg"]}
        >
          <Center>
            Contas { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Center>
        </PopoverHeader>
          { isLoading ? (
            <Loading />
          ) : (
            <>
              <PopoverBody>
                { data.balances.map(account => (
                  <Fragment key={account.account_id}>
                    <Link href={`/accounts/${account.account_id}/entries`} passHref>
                      <ChakraLink 
                        role={'group'}
                        display={'block'}
                        p={3}
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
                              { account.account_name }
                            </Text>

                            <Text as="span" fontSize={['xs', "md", "md"]} mr={1}>Saldo:</Text>
                            <Box as="span" color={account.positive ? 'blue.500' : 'red.500'}>{ account.balance } </Box>
                          </Box>
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
                <Box fontSize={['sm', "lg", "lg"]}>
                  <Text as="span" fontWeight="bold" mr="1">
                    Total:
                  </Text>
                  <Text as="span" color={data.total.positive ? 'blue.500' : 'red.500'}>
                    { data.total.value }
                  </Text>
                </Box>
              </PopoverFooter>
            </>
          )}
      </PopoverContent>
    </Popover>
  )
}