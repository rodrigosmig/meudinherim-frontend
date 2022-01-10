import { 
  Box,
  Text
} from "@chakra-ui/react";

interface AccountReportHeaderProps {
  title: string;
  color: string;
  content: string;
}

export const AccountReportHeader = ({title, color, content}: AccountReportHeaderProps) => {

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