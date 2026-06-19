"use client";

import { ReactNode } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import Text from "@/components/primitives/text";

export interface ModalConfirmacaoProps {
  title: string;
  message: string;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: () => void;
}

export function ModalConfirmacao({
  title,
  message,
  trigger,
  isOpen,
  isLoading,
  onOpenChange,
  onConfirmar,
}: ModalConfirmacaoProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} title={title} trigger={trigger}>
      <div className="flex flex-col gap-3">
        <Text variant="paragraph-medium">{message}</Text>

        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button isLoading={isLoading} onClick={onConfirmar}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
