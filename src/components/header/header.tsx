"use client";

import { cn } from '@/helpers/string-helper';
import { Plus } from 'lucide-react';
import { ComponentProps } from 'react';

import { HeaderSlot, useHeader } from '@/contexts/header-context';
import { Button } from '../primitives/button';
import UserProfile from '../user-profile';
import { ContasNav } from './contas-nav';
import NotificacoesNav from './notificacoes-nav';

interface HeaderProps {
  title?: string;
}

export function HeaderRoot({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-sm shadow-black/20 px-6 py-4">
      <div className="flex justify-end md:justify-between">
        <HeaderTitle title={title ?? ""} />

        <HeaderContent />
      </div>
    </header>
  );
}

interface HeaderTitleProps extends ComponentProps<'div'> {
  title: string;
}

function HeaderTitle({ title, className, ...props }: HeaderTitleProps) {
  const { headerTitleContent } = useHeader();

  if (headerTitleContent) {
    return (
      <div className={cn("hidden flex-1 md:flex md:items-center md:justify-between", className)} {...props}>
        {headerTitleContent}
      </div>
    );
  }
}

interface HeaderContentProps extends ComponentProps<'div'> { }

function HeaderContent({ className, ...props }: HeaderContentProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button variant="icon" tooltip="Adicionar" aria-label="Adicionar">
        <Plus className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
      </Button>

      <NotificacoesNav />

      <ContasNav />

      {/* <FaturasNav /> */}

      <UserProfile />
    </div>
  );
}

export const Header = {
  Root: HeaderRoot,
  Title: HeaderSlot,
};

export function DefaultHeader() {
  return <HeaderRoot />;
}