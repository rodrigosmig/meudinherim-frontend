import { 
  Icon,
  IconButton,
  useColorMode
} from "@chakra-ui/react";
import { BsMoon } from "react-icons/bs";
import { ImSun } from "react-icons/im";

export const ChangeTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  if (colorMode === "dark") {
    return (      
      <IconButton
        variant="ghost"
        aria-label="Change theme"
        icon={<Icon as={ImSun} fontSize="18" />}
        onClick={toggleColorMode}
      />
    )
  } else {
    return (
      <IconButton
        variant="ghost"
        aria-label="Change theme"
        icon={<Icon as={BsMoon} fontSize="18" />}
        onClick={toggleColorMode}
      />
    )
  }
}