import { memo, useState, useRef } from "react";
import {
  AlertDialog, 
  AlertDialogBody, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogOverlay, 
  Button, 
  Icon, 
  IconButton, 
  useBreakpointValue, 
  Tooltip 
} from "@chakra-ui/react";
import { GiCancel } from "react-icons/gi";

interface Props {
  label: string;
  isPayment?: boolean;
  loading: boolean;
  onCancel: () => void;
}

const CancelPaymentButtonComponent = ({ label, loading, isPayment = true, onCancel }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const paymentType = isPayment ? "Pagamento" : "Recebimento"

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  const handleOnCancel = async () => {
    await onCancel();
    onClose();
  }

  return (
    <>
    { isWideVersion ? (
      <Button
        size="sm"
        fontSize="sm"
        colorScheme="red"
        leftIcon={<Icon as={GiCancel} fontSize="16" />}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>
    ) : (
      <Tooltip label="Cancelar pagamento" aria-label="A tooltip">
        <IconButton
          size="xs"
          aria-label="Cancel Payment"
          colorScheme="purple" 
          icon={<GiCancel />} 
          onClick={() => setIsOpen(true)}
        />
      </Tooltip>
    )}

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="gray.800">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancelar { paymentType }
          </AlertDialogHeader>

          <AlertDialogBody bgColor="gray.800">
            Tem certeza que deseja cancelar o {paymentType.toLowerCase()}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              aria-label="Cancel"
              ref={cancelRef} 
              onClick={onClose} 
              variant="outline"
              isDisabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleOnCancel} ml={3}
              isLoading={loading}
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </>
  )
}

export const CancelPaymentButton = memo(CancelPaymentButtonComponent)