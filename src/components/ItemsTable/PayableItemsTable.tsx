import { memo } from "react";
import NextLink from "next/link";
import {
  HStack,
  LinkBox,
  LinkOverlay,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { PopoverTotal } from "../PopoverTotal";
import { toCurrency } from "../../utils/helpers";
import { EditButton } from "../Buttons/Edit";
import { IPayable } from "../../types/payable";
import { DeleteButton } from "../Buttons/Delete";
import { PaymentButton } from "../Buttons/Payment";
import { CancelPaymentButton } from "../Buttons/CancelPayment";
import { Check } from "../Icons/Check";
import { Close } from "../Icons/Close";

interface Props {
  data: IPayable[];
  isLoadingonDelete: boolean;
  isLoadingOnCancel: boolean;
  onEdit: (id: IPayable['id'], parcelableId: IPayable['parcelable_id']) => void;
  onDelete: (id: number) => void;
  onPayment: (id: IPayable['id'], parcelableId: IPayable['parcelable_id']) => void;
  cancelPayment: (id: IPayable['id'], parcelableId: IPayable['parcelable_id']) => void;
}

const PayableItemsTableComponent = ({ 
  data, 
  isLoadingonDelete,
  isLoadingOnCancel,
  onEdit, 
  onDelete,
  onPayment,
  cancelPayment
}: Props) => {
  return (
    <>    
      { data.map(payable => (
        <Tr key={ payable.id } px={[8]}>
          <Td fontSize={["xs", "md"]}>
            <Text fontWeight="bold">{payable.due_date}</Text>
          </Td>
          <Td fontSize={["xs", "md"]}>
            { payable.paid_date}
          </Td>
          <Td fontSize={["xs", "md"]}>
            { payable.category.name}
          </Td>
          <Td fontSize={["xs", "md"]}>
            { payable.is_parcel ? (
              <PopoverTotal
                description={payable.description}
                amount={payable.total_purchase}
              />
              ) : (
                payable.invoice ? (
                  <LinkBox>
                    <NextLink href={`/cards/${payable.invoice.card_id}/invoices/${payable.invoice.invoice_id}/entries`} passHref>
                      <LinkOverlay
                        title='Ver Fatura'
                        fontWeight={"bold"}
                        _hover={{ color: "pink.500" }}
                      >
                        { payable.description }                                   
                      </LinkOverlay>
                    </NextLink>
                  
                  </LinkBox>
                ) : (
                  payable.description

                )
              )
            }

          </Td>
          <Td>
            { payable.monthly ? <Check /> : <Close /> }
          </Td>
          <Td fontSize={["xs", "md"]}>
            { toCurrency(payable.value) }
          </Td>
          <Td fontSize={["xs", "md"]}>
            { !payable.paid ? (
              <HStack spacing={[2]}>
                <EditButton
                  isDisabled={payable.is_parcel}
                  onClick={() => onEdit(payable.id, payable.parcelable_id)}
                />

                <DeleteButton
                  isDisabled={payable.is_parcel && payable.parcel_number !== 1}
                  onDelete={() => onDelete(payable.is_parcel ? payable.parcelable_id : payable.id)} 
                  resource="Conta a Pagar"
                  loading={isLoadingonDelete}
                  isParcel={payable.is_parcel}
                />

                <PaymentButton onClick={() => onPayment(payable.id, payable.parcelable_id)} />
              </HStack>
            ) : (
              <CancelPaymentButton
                label="Cancelar Pagamento"
                loading={isLoadingOnCancel}
                onCancel={() => cancelPayment(payable.id, payable.parcelable_id)} 
              />
            )}
            
          </Td>
        </Tr>
      )) }
    </>
  )
}

export const PayableItemsTable = memo(PayableItemsTableComponent);