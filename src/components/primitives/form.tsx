import React, { ComponentProps } from 'react';

interface FormProps extends ComponentProps<'form'> {
  children: React.ReactNode;
}

export default function Form({ children, ...props }: FormProps) {
  return (
    <form className="space-y-5 p-8" {...props}>
      {children}
    </form>
  )
}