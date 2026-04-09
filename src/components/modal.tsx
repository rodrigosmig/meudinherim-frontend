import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "./primitives/button";

interface ModalProps extends Dialog.DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  children: ReactNode;
}

export default function Modal({ onOpenChange, trigger, title, children, ...props }: Readonly<ModalProps>) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} {...props}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-lg focus:outline-none">
          <div className="flex items-center justify-between mb-4 border-b-2 border-gray-700">
            <Dialog.Title className="text-lg font-bold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button icon={X} variant="icon" aria-label="Fechar" className="hover:bg-gray-600" />
            </Dialog.Close>
          </div>
          <div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
