import { memo } from "react";
import { 
  HStack, 
  Td, 
  Text, 
  Tr
} from "@chakra-ui/react";
import { IAccountEntry } from "../../types/accountEntry";
import { toCurrency } from "../../utils/helpers";
import { EditButton } from "../Buttons/Edit";
import { DeleteButton } from "../Buttons/Delete";
import { ShowPaymentButton } from "../Buttons/ShowPayment";

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
            <Text fontWeight="bold">{entry.description}</Text>
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
          { entry.account_scheduling == null ? (
            <HStack spacing={[2]}>                              
              <EditButton onClick={() => onEdit(entry.id)} />
              <DeleteButton 
                onDelete={() => onDelete(entry.id)} 
                resource="Lançamento"
                loading={isLoading}
              />
            </HStack>
            ) : (
              entry.category.type === 1 ? (
                <ShowPaymentButton
                  label="Ver Recebimento"
                  onClick={() => showReceivement(entry.account_scheduling.id, entry.account_scheduling.parcelable_id)}
                />
                
              ) : (
                <ShowPaymentButton
                  label="Ver Pagamento"
                  onClick={() => showPayment(entry.account_scheduling.id, entry.account_scheduling.parcelable_id)}
                />
              )
            )
          }
          </Td>
        </Tr>
      )) }
    </>
  )
}

export const AccountEntryItemsTable = memo(AccountEntryItemsTableComponent);