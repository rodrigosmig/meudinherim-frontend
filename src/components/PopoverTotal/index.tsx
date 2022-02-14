import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Text
} from "@chakra-ui/react";
import { toCurrency } from "../../utils/helpers";

interface Props {
  description: string;
  amount: number
}

export const PopoverTotal = ({ description, amount }:Props) => {
  return (
    <Popover trigger={"hover"}>
      <PopoverTrigger>
        <Text 
          cursor={"pointer"} 
          fontWeight="bold"
          _hover={{ color: "pink.500" }}
        >
          {description}
        </Text>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>Total da compra: {toCurrency(amount)}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}