import { useState } from "react";
import Head from "next/head";
import { 
  Flex, 
  HStack, 
  Select, 
  Spinner, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { Heading } from "../../components/Heading";
import { AddButton } from "../../components/Buttons/Add";
import { cardService } from "../../services/ApiService/CardService";
import { useCards } from "../../hooks/useCards";
import { Table } from "../../components/Table";
import { Loading } from "../../components/Loading";
import { EditButton } from "../../components/Buttons/Edit";
import { DeleteButton } from "../../components/Buttons/Delete";
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { toCurrency } from "../../utils/helpers";
import { CreateCardModal } from "../../components/Modals/cards/CreateCardModal";
import { EditCardModal } from "../../components/Modals/cards/EditCardModal";
import { InvoicesButton } from "../../components/Buttons/Invoices";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupApiClient } from "../../services/api";

interface Card {
  id: number;
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

export default function Cards() {
  const toast = useToast();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isError, refetch } = useCards();

  const tableSize = isWideVersion ? 'md' : 'sm';

  const [ selectedCard, setSelectedCard ] = useState({} as Card)

  const handleEditCard = (category_id: number) => {
    const category = getSelectedCard(category_id);
    setSelectedCard(category);
    editModalonOpen();
  }

  const getSelectedCard = (id: number) => {
    const card = data.filter(c => {
      return c.id === id
    })

    return card[0];
  }

  const deleteCard = useMutation(async (id: number) => {
    const response = await cardService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('cards')
    }
  });

  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Cartão deletado com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      refetch();
    } catch (error) {
      const data = error.response.data

      toast({
        title: "Erro",
        description: data.message,
        position: "top-right",
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <CreateCardModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={refetch}
      />

      <EditCardModal
        card={selectedCard}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={refetch}
      />

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Cartão de Crédito
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            <AddButton onClick={createModalOnOpen} />
          </Heading>
        </Flex>

        { isLoading ? (
          <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as cartões de crédito</Flex>
          ) : (
            <>
              <Table tableSize={tableSize}>
                <Thead>
                  <Tr >
                    <Th>Nome</Th>
                    <Th>Limite de Crédito</Th>
                    <Th>Limite Disponível</Th>
                    <Th>Dia do Fechamento</Th>
                    <Th>Dia do Pagamento</Th>
                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  { data.map(card => (
                    <Tr key={card.id} px={[8]}>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{card.name}</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { toCurrency(card.credit_limit) }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { toCurrency(card.balance) }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { card.closing_day }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { card.pay_day }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <HStack spacing={[2]}>
                          <EditButton onClick={() => handleEditCard(card.id)} />

                          <DeleteButton
                            onDelete={() => handleDeleteCard(card.id)} 
                            resource="Cartão"
                            loading={deleteCard?.isLoading}
                          />

                          <InvoicesButton href={`/cards/${card.id}/invoices`} />
                        </HStack>
                      </Td>
                    </Tr>
                  )) }
                </Tbody>
              </Table>
            </>
          )
        }
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  
  await apiClient.get('/cards');

  return {
    props: {}
  }
})