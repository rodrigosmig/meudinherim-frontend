import { 
  Flex, 
  Image, 
  Text, 
  useBreakpointValue, 
  useColorMode 
} from "@chakra-ui/react";

export const Logo = () => {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
    lg: true 
  })

  const { colorMode } = useColorMode()

  const url_logo = colorMode === "dark" ? '/icons/logo_white.png' : '/icons/logo_black.png'

  return (
    <>
    <Flex ml={[0, 4]}>
      {isWideVersion && (        
        <Image
          alt="Meu Dinherim"
          w={[6]}
          h={[6]}
          src={url_logo}
          objectFit="cover"
          mr={[3]}
        />
      )}
      
      <Text
        fontSize={["md", "md", "xl"]}
        fontWeight="bold"
        letterSpacing="tight"
        w="64"
      >
        Meu Dinherim
        <Text as="span" color="pink.500" ml="1">.</Text>
      </Text>
    </Flex>
    </>
  )
}