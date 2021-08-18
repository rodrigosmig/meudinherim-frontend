import { Flex, Spinner } from "@chakra-ui/react"

export const Loading = () => {
  return (
    <Flex>
      <Spinner
        color="pink" 
        m="auto"
        mt={[4]}  
      />
    </Flex>
  )
}