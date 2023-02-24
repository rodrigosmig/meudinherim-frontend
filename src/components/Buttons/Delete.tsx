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
  Tooltip, 
  useBreakpointValue } from "@chakra-ui/react"
import { memo, useRef, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri"

interface Props {
  onDelete: () => void;
  resource: string;
  loading: boolean;
  isDisabled?: boolean,
  isParcel?: boolean
}

const DeleteButtonComponent = ({ loading, resource, onDelete, isDisabled = false, isParcel = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const onClose = () => setIsOpen(false);
  
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  })

  const handleOnDelete = async () => {
    await onDelete();
    onClose()
  }

  return (
    <>
      {isWideVersion 
      ? (
        <Button
          isDisabled={isDisabled}
          size="sm"
          fontSize="sm"
          bg="purple.500"
          _hover={{ bg: "purple.300" }}
          _active={{
            bg: "purple.400",
            transform: "scale(0.98)",
          }}
          leftIcon={<Icon as={RiDeleteBin2Line} fontSize="16" />}
          onClick={() => setIsOpen(true)}
        >
          Deletar
        </Button>
        )
      : (
        <Tooltip label="Deletar" aria-label="A tooltip">
          <IconButton
            isDisabled={isDisabled}
            size="xs"
            aria-label="Delete"
            bg="purple.500"
            _hover={{ bg: "purple.300" }}
            _active={{
              bg: "purple.400",
              transform: "scale(0.98)",
            }}
            icon={<RiDeleteBin2Line />} 
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
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar { resource }
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja deletar {resource.toLowerCase()}?
              { isParcel ? " Todas as parcelas serão excluídas." : '' }
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
                bg="red.500"
                _hover={{ bg: "red.400" }}
                _active={{
                  bg: "red.300",
                  transform: "scale(0.98)",
                }}
                onClick={handleOnDelete} 
                ml={3}
                isLoading={loading}
              >
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export const DeleteButton = memo(DeleteButtonComponent);