import {
  Box,
  Center,
  Divider,
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
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Fragment, useEffect, useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { IBalanceData, ITotalData } from "../../../types/account";
import { Loading } from "../../Loading";

export const NavBalance = () => {
  const [balances, setBalances] = useState([] as IBalanceData[]);
  const [total, setTotal] = useState({} as ITotalData);
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const { data, isLoading, isFetching } = useAccountBalance('all');

  useEffect(() => {
    if (data) {
      setBalances(data.balances)
      setTotal(data.total)
    }
  }, [data])

  return (
    <Box>
      <Popover 
        isLazy 
        trigger={'hover'}
        //onOpen={refetch}
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
            fontSize={['sm', "md", "md"]}
          >
            <Center>
              Contas { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </Center>
          </PopoverHeader>
            { isLoading ? (
              <Loading mb={4} />
            ) : (
              <>
                <PopoverBody>
                  { balances.map(account => (
                    <Fragment key={account.account_id}>
                      <LinkBox>
                        <NextLink href={`/accounts/${account.account_id}/entries`} passHref>
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
                                  { account.account_name }
                                </Text>

                                <Text as="span" fontSize={['xs', "md", "md"]} mr={1}>Saldo:</Text>
                                <Box as="span" color={account.positive ? 'blue.500' : 'red.500'}>{ account.balance } </Box>
                              </Box>
                            </Stack>
                          </LinkOverlay>
                        </NextLink>
                      </LinkBox>
                      <Divider mt={1} mb={1} />
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
                    <Text as="span" color={total.positive ? 'blue.500' : 'red.500'}>
                      { total.value }
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