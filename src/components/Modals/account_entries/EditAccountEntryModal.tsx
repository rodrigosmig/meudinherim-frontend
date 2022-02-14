import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { IAccountEntry } from "../../../types/accountEntry";
import { EditAccountEntryForm } from "../../Foms/accountEntry/EditAccountEntryForm";

interface Props {
  entry: IAccountEntry;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditAccountEntryModal = ({ entry, isOpen, onClose, refetch }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bgColor={"gray.800"}>
        <ModalHeader>Editar Lançamento</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <EditAccountEntryForm
            entry={entry}
            closeModal={onClose}
            refetch={refetch}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}