import {
  Avatar as ChakraAvatar,
  Box,
  Flex,
  Menu,
  MenuButton, MenuItem,
  MenuList,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { memo, useContext } from "react";
import { AuthContext } from '../../../contexts/AuthContext';

const AvatarComponent = () => {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true 
  });

  const color = useColorModeValue('gray.600', 'gray.300')

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <Flex align="center">
      { isWideVersion && (
        !isAuthenticated 
          ? (
            <Spinner mr={4}/>
          ) 
          : (
            <Box mr="4" textAlign="right">
              <Text>{user?.name}</Text>  
              <Text color={color} fontSize="small">
                {user?.email}
              </Text>
            </Box>
          )
      )}
        
      <Menu isLazy>
        <MenuButton >
          <ChakraAvatar size="md" name={user?.name} src={user?.avatar} mr={["auto"]} />
        </MenuButton>
        
        <MenuList>
          <MenuItem onClick={handleSignOut}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export const Avatar = memo(AvatarComponent);