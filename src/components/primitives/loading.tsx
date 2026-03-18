import { cn } from '@/helpers/string-helper';
import { Loader2Icon } from 'lucide-react';

import Icon from './icon';

interface LoadingProps {
  className?: string
}

export default function Loading({ className }: LoadingProps) {
  return (
    <Icon icon={Loader2Icon} className={cn("w-6 h-6 text-primary", className)} loading />
  )
}