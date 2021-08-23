import Head from "next/head";
import { 
  Box, 
  Flex, 
  Heading, 
  HStack, 
  Select, 
  Spinner, 
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,
  useDisclosure,
  useToast, 
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { Layout } from '../../components/Layout';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { Loading } from "../../components/Loading";
import { setupApiClient } from '../../services/api';
import { categoryService } from "../../services/ApiService/CategoryService";
import { AddButton } from "../../components/Buttons/Add";
import { useCategories } from "../../hooks/useCategories";
import { EditButton } from "../../components/Buttons/Edit";
import { DeleteButton } from "../../components/Buttons/Delete";
import { ModalEditCategory } from "../../components/Modals/categories/ModalEditCategory";
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

export default function Categories() {
  const toast = useToast();
  const router = useRouter()
  const [categoryType, setCategoryType] = useState("");
  const [category, setCategory] = useState<Category>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isFetching, isError, refetch } = useCategories(categoryType);

  const handleAddCategory = () => {
    console.log("Categoria adicionada")
    router.push('/categories/create');

  }

  const handleEditCategory = (editedCategory: Category) => {
    setCategory(editedCategory);
    onOpen();
  }

  const handleChangeCategoryType = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategoryType(event.target.value)
  }
  
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);

      toast({
        title: "Sucesso",
        description: "Categoria deletada com sucesso",
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
  
  const deleteCategory = useMutation(async (id: number) => {
    const response = await categoryService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
    }
  });

  const handleCloseModal = () => {
    onClose();
    refetch();
  }

  return (
    <>
      <ModalEditCategory isOpen={isOpen} onClose={handleCloseModal} category={category} />
      <Head>
        <title>Categorias | Meu Dinherim</title>
      </Head>

      <Layout>
        <Box flex='1' borderRadius={8} bg="gray.800" p="8">
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
              Categorias
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </Heading>
            <Heading fontSize={['lg', 'lg', 'xl']} fontWeight="normal">
              <AddButton onClick={handleAddCategory} />
            </Heading>
          </Flex>

          <Select
            variant="unstyled"
            maxW={[240]}
            mb={[6]}
            onChange={event => handleChangeCategoryType(event)}
          >
            <option value="">Todas</option>
            <option value="1">Entrada</option>
            <option value="2">Saída</option>
          </Select>

          { isLoading ? (
              <Loading />
            ) : isError ? (
              <Flex justify="center">Falha ao obter as categorias</Flex>
            ) : (
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th>Nome da Categoria</Th>
                    <Th>Tipo</Th>
                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  { data.map(category => (
                    <Tr key={category.id}>
                      <Td>
                        <Text fontWeight="bold">{category.name}</Text>
                      </Td>
                      <Td>
                        { category.type === 1 ? 'Entrada' : 'Saída' }
                      </Td>
                      <Td>
                        <HStack spacing={[2]}>
                          <EditButton onClick={() => handleEditCategory(category)} />
                          <DeleteButton 
                            onDelete={() => handleDeleteCategory(category.id)} 
                            resource="Categoria"
                            loading={deleteCategory?.isLoading}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  )) }
                </Tbody>
              </Table>
            )}
        </Box>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  
  const response = await apiClient.get('/categories');

  return {
    props: {}
  }
})