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
  Text, useColorModeValue
} from "@chakra-ui/react";
import { useCallback } from "react";
import { RiNotificationLine } from "react-icons/ri";
import { useDispatch } from "../../../hooks/useDispatch";
import { useSelector } from "../../../hooks/useSelector";
import { markAllNotificationAsRead, markNotificationAsRead } from "../../../store/thunks/notificationThunk";
import { INotification } from "../../../types/notification";
import { getMessage, toBrDate, toCurrency } from "../../../utils/helpers";

export const NavNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(({notifications}) => notifications);

  const bg = useColorModeValue('gray.50', 'gray.800');

  const getType = (type: string) => {
    return type === 'payables' ? "Contas a Pagar" : "Contas a Receber";
  }

  const markAllAsRead = useCallback(async () => {
    try {
      await dispatch(markAllNotificationAsRead()).unwrap();
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }
  }, [dispatch])

  const markAsRead = useCallback(async (id: INotification['id']) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap()
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }
  }, [dispatch])

  const hasNotifications = () => {
    return notifications?.length !== 0;
  }

  const getQuantity = () => {
    return notifications?.length;
  }

  const hasManyNotification = () => {
    return notifications?.length > 4;
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
              { isLoading && <Spinner size="sm" color="gray.500" ml="4" /> }
            </Center>
          </PopoverHeader>

          <PopoverBody>
              { !hasNotifications() ? (
                <Center>
                  <Text fontWeight="bold">Nenhuma notificação</Text>
                </Center>
              ) : (
                notifications.map(notification => (
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
                          <Text 
                            data-testid="notification-description" 
                            fontSize={['xs', "md", "md"]}
                          >
                            Descrição: { notification.data.description }
                          </Text>
                          <Text
                            data-testid="notification-date"
                            fontSize={['xs', "md", "md"]}
                            fontWeight={"bold"}
                          >
                            Vencimento: { toBrDate(notification.data.due_date) }
                          </Text>
                        </Box>
                        <Flex
                          _groupHover={{ color: 'pink.400' }}
                          justify={'center'}
                          align={'center'}
                          fontSize={['sm', "md", "md"]}
                        >
                          <Text>
                            { toCurrency(notification.data.value) }                            
                          </Text>
                        </Flex>
                      </Stack>
                    </LinkOverlay>                  
                  </LinkBox>
                ))
              )}
            </PopoverBody>

          { hasNotifications() && (
            <PopoverFooter
              border='0'
              display='flex'
              justifyContent='center'
            > 
              <Button fontWeight="bold"
                data-testid="notification-button-all"
                variant="ghost"
                isLoading={isLoading}
                onClick={markAllAsRead}
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