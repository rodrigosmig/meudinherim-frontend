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

interface DeleteButtonProps {
  onDelete: () => void;
  resource: string;
  loading: boolean;
}

const DeleteButtonComponent = ({ loading, resource, onDelete }: DeleteButtonProps) => {
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
          size="sm"
          fontSize="sm"
          colorScheme="purple"
          leftIcon={<Icon as={RiDeleteBin2Line} fontSize="16" />}
          onClick={() => setIsOpen(true)}
        >
          Deletar
        </Button>
        )
      : (
        <Tooltip label="Deletar" aria-label="A tooltip">
          <IconButton
            size="xs"
            aria-label={`Delete ${resource.toLowerCase()}`}
            colorScheme="purple" 
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
          <AlertDialogContent bgColor="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar { resource }
            </AlertDialogHeader>

            <AlertDialogBody bgColor="gray.800">
              Tem certeza que deseja deletar {resource.toLowerCase()}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button 
                ref={cancelRef} 
                onClick={onClose} 
                variant="outline"
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleOnDelete} ml={3}
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