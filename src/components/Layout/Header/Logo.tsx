import { Image, Text } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <>
      <Image
        w={[6]}
        h={[6]}
        src="/icons/logo.png"
        objectFit="cover"
        mr={[3]}
      />
      <Text
        fontSize={["md", "md", "xl"]}
        fontWeight="bold"
        letterSpacing="tight"
        w="64"
      >
        Meu Dinherim
        <Text as="span" color="pink.500" ml="1">.</Text>
      </Text>
    </>
  )
}