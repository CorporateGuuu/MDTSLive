'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
}

interface DialogDescriptionProps {
  children: ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const context = useContext(DialogContext);
  if (!context) return <>{children}</>;

  return (
    <div onClick={() => context.setOpen(true)}>
      {children}
    </div>
  );
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  const context = useContext(DialogContext);
  if (!context || !context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => context.setOpen(false)} />
      <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="flex items-center justify-between mb-4">{children}</div>;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-gray-600">{children}</p>;
}
