"use client";

import Text from '@/components/primitives/text';
import { toast } from '@/components/toast';
import { getApiErrorMessage, isApiSuccessResponse } from '@/helpers/api-type-guards';
import { confirmarEmail } from '@/services/auth-service';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmarEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verificarEmail() {
      if (!token) {
        setIsLoading(false);
        setIsError(true);
        toast.error("Token de confirmação inválido. Por favor, verifique o link enviado para seu email.");
        return;
      }

      setIsLoading(true);
      setIsError(false);

      confirmarEmail({ token }).then(response => {
        if (!isApiSuccessResponse(response)) {
          setIsError(true);
          setIsLoading(false);
          toast.error(getApiErrorMessage(response, "Erro ao confirmar e-mail"));
          return;
        }
        setIsLoading(false);
        setIsError(false);

        toast.success("Conta confirmada com sucesso!");
        router.push('/login');
      });
    }

    verificarEmail();
  }, [token]);

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <Text variant="heading-large" className='mb-4'>MEU DINHEIRIM</Text>
      {isLoading && (
        <Text variant="heading-large">Confirmando seu email...</Text>
      )}

      {isError && (
        <>
          <Text className='text-red-500' variant="heading-large">
            Erro ao verificar o email.
          </Text>
          <Text >
            Clique para &nbsp;
            <Link className='hover:text-violet-500' href='/reenviar-email-confirmacao'>
              reenviar o email &nbsp;
            </Link>
            ou &nbsp;
            <Link className='hover:text-violet-500' href='/login'>
              fazer login
            </Link>
          </Text>
        </>
      )}

      {!isLoading && !isError && (
        <Text variant="heading-medium">
          Conta confirmada com sucesso! Redirecionando para login...
        </Text>
      )}
    </div>
  )
}