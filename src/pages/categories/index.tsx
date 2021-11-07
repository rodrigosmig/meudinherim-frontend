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
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";
import { Pagination } from "../../components/Pagination";
import { FilterPerPage } from '../../components/Pagination/FilterPerPage';
import { Heading } from "../../components/Heading";
import { Table } from "../../components/Table";

export default function Categories() {
  const toast = useToast();
  const router = useRouter();

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [categoryType, setCategoryType] = useState("");
  const { data, isLoading, isFetching, isError, refetch } = useCategories(categoryType, page, perPage);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  const handleAddCategory = () => {
    router.push('/categories/create');
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

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }

  const handleEditAccount = (category_id: number) => {
    router.push(`/categories/${category_id}`)
  }
  
  const deleteCategory = useMutation(async (id: number) => {
    const response = await categoryService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
    }
  });

  return (
    <>
      <Head>
        <title>Categorias | Meu Dinherim</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Categorias
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </>
          </Heading>
          <Heading>
            <AddButton onClick={handleAddCategory} />
          </Heading>
        </Flex>

        <Flex 
          justify="space-between" 
          align="center"
          mb={[6, 6, 8]}
        >
          <FilterPerPage onChange={handleChangePerPage} isWideVersion={isWideVersion} />

          <Flex align="center">
            <Select
              size={sizeProps}
              variant="unstyled"
              maxW={[150]}
              onChange={event => handleChangeCategoryType(event)}
            >
              <option value="">Todas</option>
              <option value="1">Entrada</option>
              <option value="2">Saída</option>
            </Select>
          </Flex>            
        </Flex>


        { isLoading ? (
            <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as categorias</Flex>
          ) : (
            <>
              <Table tableSize={sizeProps}>
                <>
                  <Thead>
                    <Tr>
                      <Th>Nome da Categoria</Th>
                      <Th>Tipo</Th>
                      <Th w="8"></Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    { data.categories.map(category => (
                      <Tr key={category.id}>
                        <Td fontSize={["xs", "md"]}>
                          <Text fontWeight="bold">{category.name}</Text>
                        </Td>
                        <Td fontSize={["xs", "md"]}>
                          { category.type === 1 ? 'Entrada' : 'Saída' }
                        </Td>
                        <Td fontSize={["xs", "md"]}>
                          <HStack spacing={[2]}>
                            <EditButton onClick={() => handleEditAccount(category.id)} />
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
                </>
              </Table>

              <Pagination
                from={data.meta.from}
                to={data.meta.to}
                lastPage={data.meta.last_page}
                currentPage={page}
                totalRegisters={data.meta.total}
                onPageChange={setPage}
              />

            </>
          )
        }
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