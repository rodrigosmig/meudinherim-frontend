import {
  Box, Button, Center,
  Flex,
  Icon,
  IconButton, 
  LinkBox,
  LinkOverlay, 
  Popover, 
  PopoverArrow, 
  PopoverBody, 
  PopoverContent, 
  PopoverFooter, 
  PopoverHeader, 
  PopoverTrigger, 
  Spinner, 
  Stack,
  Text, 
  useBoolean, 
  useColorModeValue
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { RiNotificationLine } from "react-icons/ri";
import { useNotifications } from "../../../hooks/useNotifications";
import { notificationService } from "../../../services/ApiService/NotificationService";
import { getMessage, toBrDate, toCurrency } from "../../../utils/helpers";
import { Loading } from "../../Loading";

export const NavNotifications = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const [flag, setFlag] = useBoolean();
  const [isLoadingRead, setIsLoadingRead] = useState(false)

  const { data, isLoading, isFetching, refetch } = useNotifications();
  
  const getType = (type: string) => {
    return type === 'payables' ? "Contas a Pagar" : "Contas a Receber";
  }

  const markAllNotificationAsRead = useCallback(async () => {
    setFlag.on();

    try {
      await notificationService.markAllAsRead();
      refetch();
      setFlag.off();
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }
  }, [refetch, setFlag])

  const markAsRead = useCallback(async (id: string) => {
    setIsLoadingRead(true)

    try {
      await notificationService.markAsRead(id);
      setIsLoadingRead(false)
      refetch();
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }
  }, [refetch])

  const hasNotifications = () => {
    return data?.length !== 0;
  }

  const getQuantity = () => {
    return data?.length;
  }

  const hasManyNotification = () => {
    return data?.length > 4;
  }

  return (
    <Box>
      <Popover
        isLazy 
        trigger={'hover'}
      >
        <PopoverTrigger>

          <IconButton
            aria-label="add menu"
            size="sm"
            variant="ghost"
            icon={<>
              <Icon as={RiNotificationLine} fontSize={[18, 20, 20]} />
              { (hasNotifications() && !isLoading) && (
                <Flex 
                  alignItems={'center'}
                  justify={'center'}
                  width={'14px'}
                  height={'14px'}
                  color={'white'} 
                  position={'absolute'} 
                  top={'4px'} 
                  right={'1px'} 
                  fontSize={'0.6rem'}
                  bgColor={'red'} 
                  borderRadius={'full'} 
                  p={"2px"}
                >
                  {getQuantity()}
                </Flex>
              ) }
          </>}
          />
        </PopoverTrigger>
        
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          height={[hasManyNotification() ? 'sm' : 'full']}
          overflowY="auto"
        >
          <PopoverArrow />
          <PopoverHeader
            fontWeight="bold" 
            fontSize={['sm', "md", "md"]}
          >
            <Center>
              Notificações 
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
              { isLoadingRead && <Spinner size="sm" color="gray.500" ml="4" /> }
            </Center>
          </PopoverHeader>

          { isLoading ? (
            <Loading />
          ) : (
            <PopoverBody>
              { !hasNotifications() ? (
                <Center>
                  <Text fontWeight="bold">Nenhuma notificação</Text>
                </Center>
              ) : (
                data.map(notification => (
                  <LinkBox
                    key={ notification.id } 
                    onClick={() => markAsRead(notification.id)}
                  >
                    <LinkOverlay 
                      href="#"                      
                      role={'group'}
                      display={'block'}
                      p={2}
                      rounded={'md'}
                      _hover={{ bg: bg }}>
                      <Stack direction={'row'} align={'center'}>
                        <Box w={72}>
                          <Text
                            transition={'all .3s ease'}
                            _groupHover={{ color: 'pink.400' }}
                            fontWeight={500}
                            fontSize={['sm', "md", "md"]}
                          >
                            { getType(notification.type) }
                          </Text>
                          <Text fontSize={['xs', "md", "md"]}>Descrição: { notification.data.description }</Text>
                          <Text 
                            fontSize={['xs', "md", "md"]}
                            fontWeight={"bold"}
                          >Vencimento: { toBrDate(notification.data.due_date) }</Text>
                        </Box>
                        <Flex
                          _groupHover={{ color: 'pink.400' }}
                          justify={'center'}
                          align={'center'}
                          fontSize={['sm', "md", "md"]}
                        >
                          { toCurrency(notification.data.value) }
                        </Flex>
                      </Stack>
                    </LinkOverlay>                  
                  </LinkBox>
                ))
              )}
            </PopoverBody>
          )}

          { hasNotifications() && (
            <PopoverFooter
              border='0'
              display='flex'
              justifyContent='center'
            > 
              <Button fontWeight="bold" 
                variant="ghost"
                isLoading={flag || isLoadingRead}
                onClick={markAllNotificationAsRead}
                fontSize={['sm', "md", "md"]}
              >
                Marcar todas como lidas
              </Button>
            </PopoverFooter>
          )}

        </PopoverContent>
      </Popover>    
    </Box>
  )
}