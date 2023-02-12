import {
  Checkbox,
  Flex,
  HStack,
  Select, Tbody,
  Td,
  Text,
  Tr,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { AddButton } from "../../components/Buttons/Add";
import { DeleteButton } from "../../components/Buttons/Delete";
import { EditButton } from "../../components/Buttons/Edit";
import { Heading } from "../../components/Heading";
import { Check } from "../../components/Icons/Check";
import { Close } from "../../components/Icons/Close";
import { Input } from "../../components/Inputs/Input";
import { Layout } from '../../components/Layout';
import { Loading } from "../../components/Loading";
import { CreateCategoryModal } from "../../components/Modals/categories/CreateCategoryModal";
import { EditCategoryModal } from "../../components/Modals/categories/EditCategoryModal";
import { Pagination } from "../../components/Pagination";
import { FilterPerPage } from '../../components/Pagination/FilterPerPage';
import { Table } from "../../components/Table";
import { useDispatch } from "../../hooks/useDispatch";
import { useSelector } from "../../hooks/useSelector";
import { setupApiClient } from '../../services/api';
import { categoryService } from "../../services/ApiService/CategoryService";
import { setActive, setCategoryType, setPage, setPerPage } from "../../store/slices/categoriesSlice";
import { deleteCategory, getCategories } from "../../store/thunks/categoriesThunk";
import { CategoryType, ICategory } from "../../types/category";
import { CATEGORIES, CATEGORIES_FORM, getMessage } from "../../utils/helpers";
import { withSSRAuth } from '../../utils/withSSRAuth';

export default function Categories() {
  const dispatch = useDispatch();
  const { isLoading, isDeleting, isError, categories, pagination, config  } = useSelector(({categories}) => categories);

  const isWideVersion = useBreakpointValue({
    base: false,
    md: false,
    lg: true 
  });

  const { isOpen: createModalIsOpen, onOpen: createModalOnOpen, onClose: createModalOnClose } = useDisclosure();
  const { isOpen: editModalIsOpen, onOpen: editModalonOpen, onClose: editModalOnClose } = useDisclosure();

  const [ selectedCategory, setSelectedCategory ] = useState({} as ICategory);
  const [filteredCategories, setFilteredCategories] = useState([] as ICategory[]);

  const sizeProps = isWideVersion ? 'md' : 'sm';

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch, config])

  useEffect(() => {
    if(categories) {
      setFilteredCategories(oldValue => categories)
    }
  }, [setFilteredCategories, categories])

  const handleChangeCategoryType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value) as CategoryType
    dispatch(setCategoryType(value))
  }
  
  const getSelectedCategory = useCallback((id: number) => {
    const category = categories.filter(c => {
      return c.id === id
    })

    return category[0];
  }, [categories]);

  const handleSetPage = useCallback((page: number) => {
    dispatch(setPage(page))
  }, [dispatch]);

  const handleChangePerPage = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value)
    dispatch(setPerPage(value));
  }, [dispatch]);

  const handleEditCategory = useCallback((category_id: number) => {
    const category = getSelectedCategory(category_id);
    setSelectedCategory(category);
    editModalonOpen();
  }, [editModalonOpen, getSelectedCategory]);

  const handleFilterCategories = useCallback((categoryName: string) => {
    if (categoryName.length === 0) {
      return setFilteredCategories(categories);
    }

    const filtered = categories.filter(
      category => category.name.toLocaleLowerCase().includes(categoryName));

    setFilteredCategories(oldValue => filtered)
  }, [categories]);

  const handleDeleteCategory = useCallback(async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap()

      return getMessage("Sucesso", "Categoria deletada com sucesso");      
    } catch (error) {
      const data = error.response.data;

      getMessage("Erro", data.message, 'error');
    }
  }, [dispatch]);

  const headList = [
    'Nome',
    'Tipo',
    'Exibir na Dashboard'
  ];

  return (
    <>
      <CreateCategoryModal
        isOpen={createModalIsOpen} 
        onClose={createModalOnClose}
      />
      <EditCategoryModal
        category={selectedCategory}
        isOpen={editModalIsOpen} 
        onClose={editModalOnClose}
      />
      <Head>
        <title>Categorias</title>
      </Head>

      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <>
              Categorias
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
              isChecked={config.active}
              onChange={() => dispatch(setActive(!config.active))}
            >
              Ativas
            </Checkbox>

            <Select
              size={sizeProps}
              variant="unstyled"
              maxW={[100]}
              onChange={event => handleChangeCategoryType(event)}
            >
              <option value="0">Todas</option>
              <option value="1">Entrada</option>
              <option value="2">Saída</option>
            </Select>
          </Flex>
        </Flex>

        <Input
          mb={[4, 4, 6]}
          name="search"
          type="text"
          placeholder="Filtrar por nome da categoria"
          onChange={event => handleFilterCategories(event.target.value)}
        />

        {isLoading && <Loading />}

        {isError && <Flex justify="center">Falha ao obter as categorias</Flex>}

        { !isLoading && !isError && (
          <>
            <Table
              isEmpty={filteredCategories.length === 0}
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
                    <Td>
                      { category.show_in_dashboard ? <Check /> : <Close /> }
                    </Td>
                    <Td fontSize={["xs", "md"]}>
                      <HStack spacing={[2]}>
                        <EditButton onClick={() => handleEditCategory(category.id)} />
                        <DeleteButton 
                          onDelete={() => handleDeleteCategory(category.id)} 
                          resource="Categoria"
                          loading={isDeleting}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                )) }
              </Tbody>
            </Table>

            <Pagination
              from={pagination.from}
              to={pagination.to}
              lastPage={pagination.last_page}
              currentPage={pagination.current_page}
              totalRegisters={pagination.total}
              onPageChange={handleSetPage}
            />

          </>
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  
  await apiClient.get('/categories');

  return {
    props: {}
  }
})