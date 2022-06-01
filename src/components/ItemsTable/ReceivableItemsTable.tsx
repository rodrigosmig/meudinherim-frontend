import { memo } from "react";
import {
  HStack,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { IReceivable } from "../../types/receivable";
import { PopoverTotal } from "../PopoverTotal";
import { toCurrency } from "../../utils/helpers";
import { EditButton } from "../Buttons/Edit";
import { DeleteButton } from "../Buttons/Delete";
import { PaymentButton } from "../Buttons/Payment";
import { CancelPaymentButton } from "../Buttons/CancelPayment";
import { Check } from "../Icons/Check";
import { Close } from "../Icons/Close";

interface Props {
  data: IReceivable[];
  isLoadingonDelete: boolean;
  isLoadingOnCancel: boolean;
  onEdit: (id: IReceivable['id'], parcelableId: IReceivable['parcelable_id']) => void;
  onDelete: (id: number) => void;
  onReceivement: (id: IReceivable['id'], parcelableId: IReceivable['parcelable_id']) => void;
  cancelReceivement: (id: IReceivable['id'], parcelableId: IReceivable['parcelable_id']) => void;
}

const ReceivableItemsTableComponent = ({ 
  data, 
  isLoadingonDelete,
  isLoadingOnCancel,
  onEdit, 
  onDelete,
  onReceivement,
  cancelReceivement
}: Props) => {
  return (
    <>
      { data.map(receivable => (
          <Tr key={ receivable.id } px={[8]}>
            <Td fontSize={["xs", "md"]}>
              <Text fontWeight="bold">{receivable.due_date}</Text>
            </Td>
            <Td fontSize={["xs", "md"]}>
              { receivable.category.name}
            </Td>
            <Td fontSize={["xs", "md"]}>
              { receivable.is_parcel ? (
                <PopoverTotal
                  description={receivable.description}
                  amount={receivable.total_purchase}
                />
                ) : (
                  receivable.description
                )
              }

            </Td>
            <Td>
              { receivable.monthly ? <Check /> : <Close /> }
            </Td>
            <Td fontSize={["xs", "md"]}>
              { toCurrency(receivable.value) }
            </Td>
            <Td fontSize={["xs", "md"]}>
              { !receivable.paid ? (
                <HStack spacing={[2]}>
                  <EditButton
                    isDisabled={receivable.is_parcel}
                    onClick={() => onEdit(receivable.id, receivable.parcelable_id)}
                  />

                  <DeleteButton
                    isDisabled={receivable.is_parcel && receivable.parcel_number !== 1}
                    onDelete={() => onDelete(receivable.is_parcel ? receivable.parcelable_id : receivable.id)} 
                    resource="Conta a Receber"
                    loading={isLoadingonDelete}
                    isParcel={receivable.is_parcel}
                  />

                  <PaymentButton
                    label={"Receber"}
                    onClick={() => onReceivement(receivable.id, receivable.parcelable_id)} 
                  />
                </HStack>
              ) : (
                <CancelPaymentButton
                  label="Cancelar Pagamento"
                  loading={isLoadingOnCancel}
                  onCancel={() => cancelReceivement(receivable.id, receivable.parcelable_id)} 
                />
              )}
              
            </Td>
          </Tr>
        )) }
    </>
  )
}

export const ReceivableItemsTable = memo(ReceivableItemsTableComponent);