import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalProps as ChakraModalProps,
  useColorModeValue
} from "@chakra-ui/react";
import { ReactNode } from "toasted-notes/node_modules/@types/react";

interface ModalProps extends ChakraModalProps {
  header: string;
  isOpen: boolean;
  size?: "xs" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ header, isOpen, size = "lg", onClose, children }: ModalProps) => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size={size} closeOnOverlayClick={false}>
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