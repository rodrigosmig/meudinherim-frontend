import { useState } from "react";
import Head from "next/head";
import { 
  Flex, 
  HStack, 
  Spinner, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useBreakpointValue,
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
import { getMessage, toCurrency } from "../../utils/helpers";
import { CreateCardModal } from "../../components/Modals/cards/CreateCardModal";
import { EditCardModal } from "../../components/Modals/cards/EditCardModal";
import { InvoicesButton } from "../../components/Buttons/Invoices";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupApiClient } from "../../services/api";
import { ICard } from "../../types/card";

export default function Cards() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isError, refetch } = useCards();

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
      queryClient.invalidateQueries('cards')
    }
  });

  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard.mutateAsync(id);

      getMessage("Sucesso", "Cart??o deletado com sucesso");

      refetch();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const headList = [
    'Nome',
    'Limite de Cr??dito',
    'Limite Dispon??vel',
    'Dia do Fechamento',
    'Dia do Pagamento'
  ];

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

      <Head>
        <title>Cart??o de Cr??dito | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Cart??o de Cr??dito
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
            <Flex justify="center">Falha ao obter as cart??es de cr??dito</Flex>
          ) : data.length === 0 ? (
            <Text>Nenhum cart??o cadastrado</Text>
          ) : (
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
                            resource="Cart??o"
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