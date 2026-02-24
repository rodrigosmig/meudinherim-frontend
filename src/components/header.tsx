import { Bell, ChevronLeft, ChevronRight, Landmark, Plus, WalletCards } from 'lucide-react';
import { ComponentProps } from 'react';
import { cn } from '@/helpers/utils';

import { Button } from './primitives/button';
import UserProfile from './user-profile';

interface HeaderProps {
  title: string;
}

export function HeaderRoot({ title }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <HeaderTitle title={title} />

        <HeaderContent />
      </div>
    </header>
  )
}

interface HeaderTitleProps extends ComponentProps<'div'> {
  title: string;
}

function HeaderTitle({ title, className, ...props }: HeaderTitleProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>

      <h2 className="hidden text-2xl font-bold text-white lg:block">
        {title}
      </h2>

      <div className="pl-10 flex items-center gap-2 md:pl-0">
        <Button variant='icon' className='hover:bg-transparent' aria-label="Voltar">
          <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </Button>
        <Button variant='icon' className='hover:bg-transparent' aria-label="Avançar">
          <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />

        </Button>
      </div>
    </div>
  );
}

interface HeaderContentProps extends ComponentProps<'div'> { }

function HeaderContent({ className, ...props }: HeaderContentProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <Button variant='icon' tooltip="Notificações" aria-label="Notificações">
        <Bell className="w-5 h-5 text-gray-400" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Button>

      <Button variant='icon' tooltip="Adicionar" aria-label="Adicionar">
        <Plus className="w-5 h-5 text-gray-400" />
      </Button>

      <Button variant='icon' tooltip="Contas" aria-label="Contas">
        <Landmark className="w-5 h-5 text-gray-400" />
      </Button>

      <Button variant='icon' tooltip="Cartões de Crédito" aria-label="Cartões de Crédito">
        <WalletCards className="w-5 h-5 text-gray-400" />
      </Button>

      <UserProfile nome='Rodrigo Miguel' email='rodrigosmig@gmail.com' />
    </div>
  );
}

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  Content: HeaderContent
}