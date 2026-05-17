import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "./primitives/button";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface ModalProps extends Dialog.DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  children: ReactNode;
  size?: keyof typeof sizeClasses;
}

export default function Modal({ onOpenChange, trigger, title, children, size = "md", ...props }: Readonly<ModalProps>) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} {...props}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className={`fixed inset-0 z-50 m-auto flex flex-col w-[calc(100%-2rem)] ${sizeClasses[size]} max-h-[90dvh] h-fit rounded-lg bg-card shadow-lg focus:outline-none`}>
          <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b-2 border-gray-700">
            <Dialog.Title className="text-lg font-bold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button icon={X} variant="icon" aria-label="Fechar" className="hover:bg-gray-600" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto px-6 py-4">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
