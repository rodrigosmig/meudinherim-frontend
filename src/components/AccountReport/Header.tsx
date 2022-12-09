import {
  Text
} from "@chakra-ui/react";

interface Props {
  title: string;
  color: string;
  content: string;
}

export const AccountReportHeader = ({title, color, content}: Props) => {

  return (
    <>
      <Text>{ title }</Text>
        <Text 
          as={"span"} 
          color={color} 
          textAlign={"center"}
        >
          { content }
        </Text>

    </>
  )
}