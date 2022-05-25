import {
  Button,
  Icon,
  HStack,
  Td, 
  Text, 
  Tr,
} from "@chakra-ui/react";
import { memo } from "react";
import { BsClock } from "react-icons/bs";
import { IInvoiceEntry } from "../../types/invoiceEntry";
import { toCurrency } from "../../utils/helpers";
import { DeleteButton } from "../Buttons/Delete";
import { EditButton } from "../Buttons/Edit";
import { PopoverTotal } from "../PopoverTotal";

interface Props {
  data: IInvoiceEntry[];
  isLoading: boolean;
  onEdit: (id: IInvoiceEntry['id'], parcelableId: IInvoiceEntry['parcelable_id']) => void;
  onDelete: (id: number) => void;
  onAnticipateInstallments: (id: IInvoiceEntry['id'], parcelableId: IInvoiceEntry['parcelable_id']) => void;
}

const InvoiceEntryItemsTableComponent = ({ 
  data, 
  isLoading, 
  onEdit, 
  onDelete,
  onAnticipateInstallments
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
            { entry.is_parcel ? (
              <PopoverTotal
                description={entry.description}
                amount={entry.total_purchase}
              />
              ) : (
                entry.description
              )
            }
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
            <HStack spacing={[2]}>
              { (!entry.is_parcel && !entry.anticipated) && (
                <>
                  <EditButton onClick={() => onEdit(entry.id, entry.parcelable_id)} />
                  <DeleteButton
                    onDelete={() => onDelete(entry.id)} 
                    resource="Lançamento"
                    loading={isLoading}
                  />
                </>
              )}

              {((entry.is_parcel || !entry.anticipated) && entry.parcel_number === 1) && (
                <>
                  <DeleteButton
                    onDelete={() => onDelete(entry.is_parcel ? entry.parcelable_id : entry.id)} 
                    resource="todas as parcelas"
                    loading={isLoading}
                  />
                </>
              )}

              {((entry.is_parcel || entry.anticipated) && entry.parcel_number < entry.parcel_total) && (
                <>
                  <Button
                    size="sm"
                    fontSize="sm"
                    bg="green.500"
                    _hover={{ bg: "green.300" }}
                    _active={{
                      bg: "green.400",
                      transform: "scale(0.98)",
                    }}
                    leftIcon={<Icon as={BsClock} fontSize="16" />}
                    onClick={() => onAnticipateInstallments(entry.id, entry.parcelable_id)} 
                  >
                    Antecipar
                  </Button>
                </>
              )}
              
            </HStack>
          </Td>
        </Tr>
      )) }
    </>
  )
}

export const InvoiceEntryItemsTable = memo(InvoiceEntryItemsTableComponent);