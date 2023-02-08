import {
  Avatar, Box, CircularProgress,
  CircularProgressLabel, Flex, FormControl,
  FormErrorMessage, FormLabel, Icon, Text, Tooltip
} from '@chakra-ui/react';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import {
  Dispatch, forwardRef, ForwardRefRenderFunction, SetStateAction, useCallback,
  useContext,
  useEffect, useState
} from 'react';
import {
  FieldError,
  FieldValues,
  UseFormSetError,
  UseFormTrigger
} from 'react-hook-form';
import { FiAlertCircle, FiPlus } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import { useDispatch } from '../../hooks/useDispatch';
import { useSelector } from '../../hooks/useSelector';
import { useUser } from '../../hooks/useUser';
import { profileService } from '../../services/ApiService/ProfileService';
import { changeAvatar } from '../../store/slices/authSlice';
import { getMessage } from '../../utils/helpers';

export interface FileInputProps {
  name: string;
  error?: FieldError;
  localImageUrl: string;
  setLocalImageUrl: Dispatch<SetStateAction<string>>;
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
    setError,
    onChange,
    trigger,
    ...rest
  },
  ref
) => {
  const dispatch = useDispatch();
  const { user } = useSelector(({auth}) => auth)

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
        
        dispatch(changeAvatar(response.data.avatar))
        
        getMessage("Sucesso", 'Imagem alterada com sucesso');
      } catch (err) {
        if (err?.message === 'Cancelled image upload.') return;

        getMessage("Falha no envio", "Ocorreu um erro ao realizar o upload da sua imagem", 'error');
      } finally {
        setIsSending(false);
        setProgress(0);
      }
    },
    [onChange, setError, setLocalImageUrl, dispatch, trigger]
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
          <Avatar
            w="full"
            h="full"
            src={user?.avatar}
            name={user?.name}
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
