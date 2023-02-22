import {
  Box,
  Center,
  Divider,
  Icon, IconButton, LinkBox,
  LinkOverlay,
  Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Stack, Text,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Fragment } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useSelector } from "../../../hooks/useSelector";
import { Loading } from "../../Loading";

export const NavBalance = () => {
  const { isLoading, balances, total } = useSelector(({accountsBalance}) => accountsBalance)

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const hasManyBalances = () => {
    return balances?.length > 4;
  }

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
            icon={<Icon as={HiOutlineCurrencyDollar} fontSize={[18, 20, 20]} />}
          />
        </PopoverTrigger>
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          width={['56', '72']}
          height={[hasManyBalances() ? 'sm' : 'full']}
          overflowY="auto"
        >
          <PopoverArrow />
          <PopoverHeader 
            fontWeight="bold" 
            fontSize={['sm', "md", "md"]}
          >
            <Center>
              Contas
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