import { HStack, } from "@chakra-ui/react";

import { NavNotifications } from "./NavNotifications";
import { NavInvoices } from "./NavInvoices";
import { ChangeTheme } from "./ChangeTheme";
import { NavBalance } from "./NavBalance";
import { NavAdd } from "./NavAdd";

export const MenuNav = () => {
  return (
    <HStack spacing={2}
      mx={["4", "4", "6"]}
      pr={["4", "4", "6"]}
      borderRightWidth={1}
    >
      <ChangeTheme />
      <NavNotifications />
      <NavAdd />
      <NavBalance />
      <NavInvoices />

    </HStack>
  )
}