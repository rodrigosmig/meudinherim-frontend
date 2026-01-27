import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Text,
  Tag,
  Flex
} from "@chakra-ui/react";
import { FaTag } from "react-icons/fa";

interface Props {
  tags: string[]
}

export const PopoverTag = ({ tags }:Props) => {
  return (
    <Popover trigger={"hover"}>
        <PopoverTrigger>
          <Text 
            cursor={"pointer"} 
            fontWeight="bold"
            _hover={{ color: "pink.500" }}
          >
            <FaTag/>
          </Text>
        </PopoverTrigger>
        <PopoverContent w={"full"}>
          <PopoverArrow />
          <PopoverBody>
            <Flex 
              wrap="wrap" 
              gap={2}
              justify="center">
              {tags.map(tag => (
                <Tag
                  key={tag}
                  size="sm" 
                  variant='solid' 
                  colorScheme='pink'
                >
                  {tag}
                </Tag>
              ))}
            </Flex>
            </PopoverBody>
        </PopoverContent>
    </Popover>
  )
}