import { ComponentProps } from 'react';

interface TdProps extends ComponentProps<'td'> { }

export default function Td({ ...props }: TdProps) {
  return (
    <td className="px-6 py-4" {...props}></td>
  )
}