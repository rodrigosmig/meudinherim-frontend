import { 
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, 
  Select,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { categoryService } from "../../../services/ApiService/CategoryService";
import { EditCategoryForm } from "../../Foms/EditCategoryForm";
import { Input } from "../../Inputs/Input";
import { SubmitButton } from "../../Buttons/Submit";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface ModalEditCategoryProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalEditCategory({ category, isOpen, onClose}: ModalEditCategoryProps) {
  

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="scale"
    >
      <ModalOverlay  />
      <ModalContent bgColor="gray.800">
        <ModalHeader bgColor="gray.800">Editar Categoria</ModalHeader>

        <ModalCloseButton />

        <ModalBody pb={6}>
          <EditCategoryForm category={category} closeModal={onClose} />
        </ModalBody>

      </ModalContent>
    </Modal>
  )
}