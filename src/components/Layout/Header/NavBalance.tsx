import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Spinner,
  Text,
  Tooltip
} from "@chakra-ui/react";
import Link from "next/link";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useAccountBalance } from "../../../hooks/useAccountBalance";

export const NavBalance = () => {
  const { data, isFetching, refetch } = useAccountBalance(null);

  return (
    <Menu isLazy onOpen={() => refetch()}>
      <Tooltip label="Saldo" bg="pink.600">
        <MenuButton>
            <Icon as={HiOutlineCurrencyDollar} fontSize="20" />
        </MenuButton>
      </Tooltip>
      <MenuList color='gray.900'>
      <Box fontSize={["xl"]} align="center">Contas
      { isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
      </Box>
        <MenuDivider />
        { data?.balances.map(account => (
            <MenuGroup key={account.account_id} title={account.account_name}>
              <Link href={`/accounts/${account.account_id}/entries`} passHref>
                <MenuItem>
                  <HStack spacing={2}>
                    <>
                      <Text>Saldo:</Text> 
                      <Box color={account.positive ? 'blue.500' : 'red.500'}>{ account.balance } </Box>
                    </>
                  </HStack>
                </MenuItem>              
              </Link>
              <MenuDivider />
            </MenuGroup>
        ))}        
        <MenuItem justify="center" align="center">
          <HStack spacing={2}>
            <Text>Total:</Text> 
            <Box color={data?.total.positive ? 'blue.500' : 'red.500'}>{ data?.total.value } </Box>
            </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}