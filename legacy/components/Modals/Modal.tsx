import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalProps as ChakraModalProps,
  useColorModeValue,
  useBreakpointValue
} from "@chakra-ui/react";
import { ReactNode } from "react"

interface Props extends ChakraModalProps {
  header: string;
  isOpen: boolean;
  size?: "xs" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ header, isOpen, size = "lg", onClose, children }: Props) => {
  const bgColor = useColorModeValue("white", "gray.800");

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const modalSize =  isWideVersion ? size : 'xs';

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size={modalSize} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader fontSize={"md"}>{header}</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={4}>
          { children }
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}