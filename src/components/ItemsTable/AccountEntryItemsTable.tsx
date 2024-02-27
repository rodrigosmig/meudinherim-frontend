import { memo } from "react";
import { 
  Flex,
  HStack, 
  Popover, 
  PopoverArrow, 
  PopoverBody, 
  PopoverContent, 
  PopoverTrigger, 
  Tag, 
  Td, 
  Text, 
  Tr
} from "@chakra-ui/react";
import { IAccountEntry } from "../../types/accountEntry";
import { toCurrency } from "../../utils/helpers";
import { EditButton } from "../Buttons/Edit";
import { DeleteButton } from "../Buttons/Delete";
import { ShowPaymentButton } from "../Buttons/ShowPayment";
import { PopoverTag } from "../PopoverTag/PopoverTag";

interface Props {
  data: IAccountEntry[];
  isLoading: boolean;
  onEdit: (id: IAccountEntry['id']) => void;
  onDelete: (id: IAccountEntry['id']) => void;
  showReceivement: (id: IAccountEntry['account_scheduling']['id'], parcelableId: IAccountEntry['account_scheduling']['parcelable_id']) => void;
  showPayment: (id: IAccountEntry['account_scheduling']['id'], parcelableId: IAccountEntry['account_scheduling']['parcelable_id']) => void;
}

const AccountEntryItemsTableComponent = ({ 
  data, 
  isLoading, 
  onEdit, 
  onDelete,
  showReceivement,
  showPayment
}: Props) => {

  const hasAccountScheduling = (entry: IAccountEntry) => {
    return entry.account_scheduling != null;
  }

  return (
    <>
      { data.map(entry => (
        <Tr key={entry.id}>
          <Td fontSize={["xs", "md"]}>
            <Text fontWeight="bold">{ entry.date }</Text>
          </Td>
          <Td fontSize={["xs", "md"]}>
            <Text fontWeight="bold">{entry.category.name}</Text>
          </Td>
          <Td fontSize={["xs", "md"]}>
            <Text fontWeight="bold">
              <Flex gap={2}>
                {entry.description}
                {entry.tags.length !== 0 && (
                  <PopoverTag tags={entry.tags} />
                )}                
              </Flex>            
            </Text>
          </Td>
          <Td fontSize={["xs", "md"]}>
            <Text 
            fontWeight="bold" 
            color={entry.category.type == 1 ? "blue.500" : "red.500"}
          >
            { toCurrency(entry.value) }
          </Text>
          </Td>
          <Td fontSize={["xs", "md"]}>
          { !hasAccountScheduling(entry) && (
            <HStack spacing={[2]}>                              
              <EditButton onClick={() => onEdit(entry.id)} />
              <DeleteButton 
                onDelete={() => onDelete(entry.id)} 
                resource="Lançamento"
                loading={isLoading}
              />
            </HStack>
          )}
          { hasAccountScheduling(entry) && entry.category.type === 1 && (
            <ShowPaymentButton
              label="Ver Recebimento"
              onClick={() => showReceivement(entry.account_scheduling.id, entry.account_scheduling.parcelable_id)}
            />
          )}
          { hasAccountScheduling(entry) && entry.category.type === 2 && (
            <ShowPaymentButton
              label="Ver Pagamento"
              onClick={() => showPayment(entry.account_scheduling.id, entry.account_scheduling.parcelable_id)}
            />
          )}
          </Td>
        </Tr>
      )) }
    </>
  )
}

export const AccountEntryItemsTable = memo(AccountEntryItemsTableComponent);