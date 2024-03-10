import Head from "next/head";
import { 
  Flex,
  Box,
  Text,
} from "@chakra-ui/react"
import { Heading } from "../../../components/Heading"
import { Layout } from "../../../components/Layout"
import { DateFilter } from "../../../components/DateFilter";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupApiClient } from "../../../services/api";
import { useDateFilter } from "../../../contexts/DateFilterContext";
import { AccountByCategoryReport } from "../../../components/AccountByCategoryReport";
import { Select } from "../../../components/Inputs/Select";
import { ChangeEvent, useCallback, useState } from "react";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { Loading } from "../../../components/Loading";
import { ActionMeta, CreatableSelect as MultiSelect, MultiValue } from "chakra-react-select";
import { useTags } from "../../../hooks/useTags";

export default function AccountTotalByCategoryReport() {
  const { startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();
  const [accountId, setAccountId] = useState(0);
  const [selectedTags, setSelectedTags] = useState([] as string[]);

  const { data: accounts, isLoading: isLoadingAccounts, isFetching: isFetchingAccounts } = useAccountsForm(true);
  const { data: dataTags, isLoading: isLoadingTags } = useTags();

  const tags = dataTags?.map(tag => {
    return {
      value: tag.name,
      label: tag.name
    }
  });

  const handleChangeAccount = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    setAccountId(Number(id))
  }, [])

  const handleChangeTags = (data: MultiValue<{ value: string; label: string; }>, action: ActionMeta<{value: string, label: string}>) => {
    const nameTags = data.map(tag => tag.value)
    setSelectedTags(oldValue => nameTags)
  }

  return (
    <>
      <Head>
        <title>Lançamentos em contas por categoria | Meu Dinherim</title>
      </Head>
      <Layout>
        <Box mb={[6, 6, 8]}>
          <Heading>
            <Text>Relatório de lançamentos em contas por categoria</Text>
          </Heading>
        </Box>

        <Flex
          direction={["column" , "row", "row"]}
          justify={['space-between']}
          align={['center', 'flex-start', 'flex-start']}
          mb={[6, 0]}
        >
          <DateFilter
            label="Selecione um período"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
            onClick={handleDateFilter}
          />
          <Box>
            { (isLoadingAccounts || isFetchingAccounts) 
              ? (
                  <Loading />
                )
              : (
                <Select
                  name="account_id"
                  options={accounts}
                  variant="unstyled"
                  maxW={[200]}
                  onChange={handleChangeAccount}
                />
              )
            }
          </Box>          
        </Flex>
        <Box mb={[10, 0]}>
          <MultiSelect
            instanceId="select-tags"
            isLoading={isLoadingTags}
            isMulti
            colorScheme="pink"
            options={tags}          
            focusBorderColor="pink.500"
            placeholder="Tags..."
            chakraStyles={{
              dropdownIndicator: (provided) => ({
                ...provided,
                bg: "transparent",
                px: 2,
                cursor: "inherit",
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: "none",
              }),
            }}
            closeMenuOnSelect={false}
            hasStickyGroupHeaders
            onChange={handleChangeTags}
          />
        </Box>
            
        <Box mt={8}>
          <AccountByCategoryReport accountId={accountId} tags={selectedTags} />
        </Box>
        
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  await apiClient.get('/auth/me');

  return {
    props: {}
  }
})