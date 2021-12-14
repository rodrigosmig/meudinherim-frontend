import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
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
      <Text fontWeight="bold">{description}</Text>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>Total da compra: {toCurrency(amount)}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}