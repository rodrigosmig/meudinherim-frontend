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
  import { MdMoneyOff } from "react-icons/md"
  
  interface Props {
    onSetPaid: () => void;
    loading: boolean;
  }
  
  const SetPaidButtonComponent = ({ loading, onSetPaid }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef();
    const onClose = () => setIsOpen(false);
    
    const isWideVersion = useBreakpointValue({
      base: false,
      md: false,
      lg: true 
    })
  
    const handleOnSetPaid = async () => {
      onSetPaid();
      onClose()
    }
  
    return (
      <>
        {isWideVersion 
        ? (
          <Button
            bg="pink.500"
            _hover={{ bg: "pink.300" }}
            _active={{
              bg: "pink.400",
              transform: "scale(0.98)",
            }}
            leftIcon={<Icon as={MdMoneyOff} fontSize="16" />}
            onClick={() => setIsOpen(true)}
          >
            Marcar como Paga
          </Button>
          )
        : (
          <Tooltip label="Deletar" aria-label="A tooltip">
            <IconButton
              size="xs"
              aria-label="Delete"
              bg="pink.500"
              _hover={{ bg: "pink.300" }}
              _active={{
                bg: "pink.400",
                transform: "scale(0.98)",
              }}
              icon={<MdMoneyOff />} 
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
                Marcar fatura como paga
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Tem certeza que deseja marcar a fatura como paga?
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
                  onClick={handleOnSetPaid} 
                  ml={3}
                  isLoading={loading}
                >
                  Marcar como paga
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
  
  export const SetPaidButton = memo(SetPaidButtonComponent);