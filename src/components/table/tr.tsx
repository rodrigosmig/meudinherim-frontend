import { ComponentProps } from 'react';

interface TrProps extends ComponentProps<'tr'> { }

export default function Tr({ ...props }: TrProps) {
  return (
    <tr className="transition-all duration-200 ease-in-out hover:bg-violet-600/5" {...props}></tr>
  )
}