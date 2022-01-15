import {  
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverFooter,
  Stack,
  Text,
  useColorModeValue,
  Spinner,
  Button,
  useBoolean,
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react";
import { useState } from "react";
import { RiNotificationLine } from "react-icons/ri";
import { useNotifications } from "../../../hooks/useNotifications";
import { notificationService } from "../../../services/ApiService/NotificationService";
import { getMessage, toBrDate } from "../../../utils/helpers";
import { Loading } from "../../Loading";

export const NavNotifications = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const [flag, setFlag] = useBoolean();
  const [isLoadingRead, setIsLoadingRead] = useState(false)

  const { data, isLoading, isFetching, refetch } = useNotifications();
  
  const getType = (type: string) => {
    return type === 'payables' ? "Contas a Pagar" : "Contas a Receber";
  }

  const markAllNotificationAsRead = async () => {
    setFlag.on();

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }   

    setFlag.off();

    refetch();
  }

  const markAsRead = async (id: string) => {
    setIsLoadingRead(true)

    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      getMessage("Erro", error.response.data.message, 'error');
    }

    setIsLoadingRead(false)

    refetch();
  }

  const hasNotifications = () => {
    return data?.length !== 0;
  }

  const getQuantity = () => {
    return data?.length;
  }

  return (
    <>
      <Popover
        isLazy 
        trigger={'hover'}
        onOpen={refetch}
      >
        <PopoverTrigger>

          <IconButton
            aria-label="add menu"
            size="sm"
            variant="ghost"
            icon={<>
              <Icon as={RiNotificationLine} fontSize={[18, 20, 20]} />
              { hasNotifications() && (
                <Box 
                  as={'span'} 
                  color={'white'} 
                  position={'absolute'} 
                  top={'4px'} 
                  right={'4px'} 
                  fontSize={'0.8rem'}
                  bgColor={'red'} 
                  borderRadius={'full'} 
                  zIndex={9999}
                  p={"1px"}
                >
                  {getQuantity()}
              </Box>
              ) }
          </>}
          />
        </PopoverTrigger>
        
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          rounded={'xl'}
          minW={['md']}
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
                          R$ 10.910,00
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
              d='flex'
              alignItems='center'
              justifyContent='center'
              pb={4}
            > 
              <Button fontWeight="bold" 
                variant="ghost"
                isLoading={flag}
                onClick={markAllNotificationAsRead}
              >
                Marcar todas como lidas
              </Button>
            </PopoverFooter>
          )}

        </PopoverContent>
      </Popover>    
    </>
  )
}