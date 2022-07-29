import Head from "next/head";
import { 
  Box,
  Checkbox,
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
  useDisclosure
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
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
import { Pagination } from "../../components/Pagination";
import { FilterPerPage } from '../../components/Pagination/FilterPerPage';
import { Heading } from "../../components/Heading";
import { Table } from "../../components/Table";
import { EditCategoryModal } from "../../components/Modals/categories/EditCategoryModal";
import { CreateCategoryModal } from "../../components/Modals/categories/CreateCategoryModal";
import { getMessage } from "../../utils/helpers";
import { ICategory } from "../../types/category";
import { Input } from "../../components/Inputs/Input";

export default function Categories() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [categoryType, setCategoryType] = useState("");
  const [active, setActive] = useState(true);
  const { data, isLoading, isFetching, isError, refetch } = useCategories(categoryType, active, page, perPage);
  const [ selectedCategory, setSelectedCategory ] = useState({} as ICategory);
  const [filteredCategories, setFilteredCategories] = useState([] as ICategory[]);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  useEffect(() => {
    if (data) {
      setFilteredCategories(oldValue => data.categories);
    }
  }, [data])

  const handleChangeCategoryType = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategoryType(event.target.value)
  }
  
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);

      getMessage("Sucesso", "Categoria deletada com sucesso");

      refetch();
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    setPage(1)
    setPerPage(value)
  }

  const handleEditCategory = (category_id: number) => {
    const category = getSelectedCategory(category_id);
    setSelectedCategory(category);
    editModalonOpen();
  }

  const getSelectedCategory = (id: number) => {
    const category = filteredCategories.filter(c => {
      return c.id === id
    })

    return category[0];
  }

  const handleFilterCategories = (categoryName: string) => {
    if (categoryName.length === 0) {
      return setFilteredCategories(data.categories);
    }

    const filtered = data.categories.filter(category => category.name.includes(categoryName));

    setFilteredCategories(oldValue => filtered)
  }
  
  const deleteCategory = useMutation(async (id: number) => {
    const response = await categoryService.delete(id);
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
    }
  });

  const headList = [
    'Nome',
    'Tipo'
  ];

  return (
    <>
      <CreateCategoryModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
        refetch={refetch}
      />
      <EditCategoryModal
        category={selectedCategory}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
        refetch={refetch}
      />
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
            <AddButton onClick={createModalOnOpen} />
          </Heading>
        </Flex>

        <Flex
          justify="space-between" 
          align="center"
          mb={[4, 4, 6]}
        >
          <FilterPerPage onChange={handleChangePerPage} isWideVersion={isWideVersion} />

          <Flex 
            width={200}
            justify="space-between"
          >
            <Checkbox 
              colorScheme={'pink'}
              isChecked={active}
              onChange={() => setActive(!active)}
            >
              Ativas
            </Checkbox>

            <Select
              size={sizeProps}
              variant="unstyled"
              maxW={[100]}
              onChange={event => handleChangeCategoryType(event)}
            >
              <option value="">Todas</option>
              <option value="1">Entrada</option>
              <option value="2">Saída</option>
            </Select>
          </Flex>
        </Flex>

        <Input
          bgColor="gray.900"
          mb={[4, 4, 6]}
          name="search"
          type="text"
          placeholder="Filtrar por nome da categoria"
          onChange={event => handleFilterCategories(event.target.value)}
        />

        { isLoading ? (
            <Loading />
          ) : isError ? (
            <Flex justify="center">Falha ao obter as categorias</Flex>
          ) : (
            <>
              <Table
                theadData={headList}
                size={sizeProps}
              >
                <Tbody>
                  { filteredCategories.map(category => (
                    <Tr key={category.id}>
                      <Td fontSize={["xs", "md"]}>
                        <Text fontWeight="bold">{category.name}</Text>
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        { category.type === 1 ? 'Entrada' : 'Saída' }
                      </Td>
                      <Td fontSize={["xs", "md"]}>
                        <HStack spacing={[2]}>
                          <EditButton onClick={() => handleEditCategory(category.id)} />
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