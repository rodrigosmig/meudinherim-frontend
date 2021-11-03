import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Text
} from "@chakra-ui/react";
import { toCurrency } from "../../utils/helpers";

interface PopoverTotalProps {
  description: string;
  amount: number
}

export const PopoverTotal = ({ description, amount }:PopoverTotalProps) => {
  return (
    <Popover trigger={"hover"}>
      <PopoverTrigger>
      <Text>{description}</Text>
      </PopoverTrigger>
      <PopoverContent color='gray.900'>
        <PopoverArrow />
        <PopoverBody>Total da compra: {toCurrency(amount)}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}