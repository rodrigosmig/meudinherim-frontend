import { useContext } from "react";
import Link from 'next/link';
import { AuthContext } from '../../../contexts/AuthContext';
import { 
  Avatar as ChakraAvatar, 
  Box, 
  Flex,
  Menu,
  MenuButton, 
  MenuDivider,
  MenuItem,
  MenuList,
  Text
} from "@chakra-ui/react";

interface AvatarProps {
  showProfileData: boolean
}

export const Avatar = ({ showProfileData }: AvatarProps) => {
  const { user, signOut } = useContext(AuthContext)

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>  
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}
        
      <Menu isLazy>
        <MenuButton >
          <ChakraAvatar size="md" name={user?.name} src={user?.avatar} mr={["auto"]} />
        </MenuButton>
        
        <MenuList color='gray.900'>
          <Link href="/profile" passHref>
            <MenuItem>
              Perfil
            </MenuItem>
          </Link>

          <MenuDivider />

          <MenuItem onClick={handleSignOut}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}