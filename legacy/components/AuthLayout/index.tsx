
import { memo, ReactNode } from 'react';
import { 
  Box,
  Flex,
  FlexProps,
  Heading, 
  Image, 
  useColorMode, 
  useColorModeValue 
} from '@chakra-ui/react';
import { ChangeTheme } from '../Layout/Header/ChangeTheme';

interface Props extends FlexProps {
  children: ReactNode
}

const AuthLayoutComponent = ({ children, ...rest }: Props) => {
  const { colorMode } = useColorMode()

  const url_logo = colorMode === "dark" ? '/icons/logo_white.png' : '/icons/logo_black.png'

  return (
    <Flex
      direction={'column'}
      w={['100vw']}
      h={['100vh']}
      bg={useColorModeValue('gray.50', 'gray.900')}
      { ...rest }
    >
      <Box p={2}>
        <ChangeTheme />
      </Box>

      <Flex
        direction="column"
        w="100%"
        h="100%"
        justify="center"
        align="center"
      >
        <Flex justify="center" align="center" mb={[6]}>
          <Image
            alt="Meu Dinherim"
            w={[10]}
            h={[10]}
            src={url_logo}
            objectFit="cover"
            mr={[6]}
          />

          <Heading>
            Meu Dinherim
          </Heading>
        </Flex>

        { children }

      </Flex>
    </Flex>
  )
}

export const AuthLayout = memo(AuthLayoutComponent);