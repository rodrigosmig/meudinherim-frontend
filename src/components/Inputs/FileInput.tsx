import {
  useState,
  SetStateAction,
  Dispatch,
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import {
  Box,
  FormLabel,
  CircularProgress,
  CircularProgressLabel,
  Icon,
  Image,
  Text,
  FormControl,
  FormErrorMessage,
  Flex,
  useToast,
  Tooltip,
} from '@chakra-ui/react';

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

import {
  FieldError,
  FieldValues,
  UseFormSetError,
  UseFormTrigger,
} from 'react-hook-form';

import { FiAlertCircle, FiPlus } from 'react-icons/fi';
import { profileService } from '../../services/ApiService/ProfileService';
import { AuthContext } from '../../contexts/AuthContext';

interface User {
  id: number;
  name: string
  email: string;
  avatar: string;
  enable_notification: boolean;
}

export interface FileInputProps {
  name: string;
  error?: FieldError;
  localImageUrl: string;
  setLocalImageUrl: Dispatch<SetStateAction<string>>;
  updateUser: (user: User) => void
  setError: UseFormSetError<FieldValues>;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<boolean | void>;
  trigger: UseFormTrigger<FieldValues>;
}

const FileInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  FileInputProps
> = (
  {
    name,
    error = null,
    localImageUrl,
    setLocalImageUrl,
    updateUser,
    setError,
    onChange,
    trigger,
    ...rest
  },
  ref
) => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [cancelToken, setCancelToken] = useState<CancelTokenSource>(
    {} as CancelTokenSource
  );

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      if (!event.target.files?.length) {
        return;
      }

      setError('image', null);
      setIsSending(true);

      await onChange(event);
      trigger('image');

      const formData = new FormData();

      formData.append('file', event.target.files[0]);

      const { CancelToken } = axios;
      const source = CancelToken.source();
      setCancelToken(source);

      const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (e: ProgressEvent) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
        cancelToken: source.token,
      } as AxiosRequestConfig;

      try {
        const response = await profileService.updateAvatar(formData, config);

        setLocalImageUrl(URL.createObjectURL(event.target.files[0]));

        const userUpdated = {...user, avatar: response.data.avatar}

        updateUser(userUpdated)

        toast({
          title: 'Sucesso',
          description: 'Imagem alterada com sucesso.',
          position: "top-right",
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      } catch (err) {
        if (err?.message === 'Cancelled image upload.') return;

        toast({
          title: 'Falha no envio',
          description: 'Ocorreu um erro ao realizar o upload da sua imagem.',
          position: "top-right",
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      } finally {
        setIsSending(false);
        setProgress(0);
      }
    },
    [onChange, setError, setLocalImageUrl, updateUser, trigger, user, toast]
  );

  useEffect(() => {
    if (error?.message && isSending && cancelToken?.cancel) {
      cancelToken.cancel('Cancelled image upload.');
      setCancelToken(null);
    }
  }, [cancelToken, error, isSending]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel
        mx="auto"
        w={[36, 36, 40]}
        h={[36, 36, 40]}
        htmlFor={name}
        cursor={isSending ? 'progress' : 'pointer'}
        opacity={isSending ? 0.5 : 1}
      >
        {localImageUrl && !isSending ? (
          <Image
            w="full"
            h="full"
            src={localImageUrl}
            alt="Avatar"
            borderRadius="full"
            objectFit="cover"
          />
        ) : (
          <Flex
            w="full"
            h="full"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
            bgColor="pGray.800"
            color="pGray.200"
            borderWidth={error?.message && 2}
            borderColor={error?.message && 'red.500'}
          >
            {isSending ? (
              <>
                <CircularProgress
                  trackColor="pGray.200"
                  value={progress}
                  color="orange.500"
                >
                  <CircularProgressLabel>{progress}%</CircularProgressLabel>
                </CircularProgress>
                <Text as="span" pt={2} textAlign="center">
                  Enviando...
                </Text>
              </>
            ) : (
              <Box pos="relative" h="full">
                {!!error && (
                  <Tooltip label={error.message} bg="red.500">
                    <FormErrorMessage
                      pos="absolute"
                      right={2}
                      top={2}
                      mt={0}
                      zIndex="tooltip"
                    >
                      <Icon as={FiAlertCircle} color="red.500" w={4} h={4} />
                    </FormErrorMessage>
                  </Tooltip>
                )}

                <Flex
                  h="full"
                  alignItems="center"
                  justifyContent="center"
                  flexDir="column"
                >
                  <Icon as={FiPlus} w={14} h={14} />
                  <Text as="span" pt={2} textAlign="center">
                    Adicione sua imagem
                  </Text>
                </Flex>
              </Box>
            )}
          </Flex>
        )}
        <input
          data-testid={name}
          disabled={isSending}
          id={name}
          name={name}
          onChange={handleImageUpload}
          ref={ref}
          type="file"
          style={{
            display: 'none',
          }}
          {...rest}
        />
      </FormLabel>
    </FormControl>
  );
};

export const FileInput = forwardRef(FileInputBase);
