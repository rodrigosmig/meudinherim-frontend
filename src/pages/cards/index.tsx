import {
  Flex,
  HStack,
  Spinner,
  Tbody,
  Td,
  Text, Tr,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { AddButton } from "../../components/Buttons/Add";
import { DeleteButton } from "../../components/Buttons/Delete";
import { EditButton } from "../../components/Buttons/Edit";
import { InvoicesButton } from "../../components/Buttons/Invoices";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { CreateCardModal } from "../../components/Modals/cards/CreateCardModal";
import { EditCardModal } from "../../components/Modals/cards/EditCardModal";
import { Table } from "../../components/Table";
import { useCards } from "../../hooks/useCards";
import { setupApiClient } from "../../services/api";
import { cardService } from "../../services/ApiService/CardService";
import { ICard } from "../../types/card";
import { CARDS, CARDS_FORM, getMessage, OPEN_INVOICES, toCurrency } from "../../utils/helpers";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Cards() {
  const queryClient = useQueryClient();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isError } = useCards();

  const tableSize = isWideVersion ? 'md' : 'sm';

  const [ selectedCard, setSelectedCard ] = useState({} as ICard)

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
      queryClient.invalidateQueries(CARDS)
      queryClient.invalidateQueries(CARDS_FORM)
      queryClient.invalidateQueries(OPEN_INVOICES)
    }
  });

  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard.mutateAsync(id);

      getMessage("Sucesso", "Cartão deletado com sucesso");
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const headList = [
    'Nome',
    'Limite de Crédito',
    'Limite Disponível',
    'Dia do Fechamento',
    'Dia do Pagamento'
  ];

  return (
    <>
      <CreateCardModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />

      <EditCardModal
        card={selectedCard}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
      />

      <Head>
        <title>Cartão de Crédito | Meu Dinherim</title>
      </Head>

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

        {isLoading && <Loading />}

        {isError && <Flex justify="center">Falha ao obter os cartões de crédito</Flex>}

        {!isLoading && !isError && data.length === 0 && <Text>Nenhum cartão cadastrado</Text>}

        {!isLoading && !isError && data.length !== 0 && (
          <>
            <Table
              theadData={headList}
              size={tableSize}>
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
        )}
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