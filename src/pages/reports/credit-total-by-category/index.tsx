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
import { CreditByCategoryReport } from "../../../components/CreditByCategoryReport";
import { ActionMeta, CreatableSelect as MultiSelect, MultiValue } from "chakra-react-select";
import { useTags } from "../../../hooks/useTags";
import { useState } from "react";

export default function CreditTotalByCategoryReport() {
  const { startDate, endDate, setDateRange, handleDateFilter } = useDateFilter();
  const [selectedTags, setSelectedTags] = useState([] as string[]);

  const { data: dataTags, isLoading: isLoadingTags } = useTags();

  const tags = dataTags?.map(tag => {
    return {
      value: tag.name,
      label: tag.name
    }
  });

  const handleChangeTags = (data: MultiValue<{ value: string; label: string; }>, action: ActionMeta<{value: string, label: string}>) => {
    const nameTags = data.map(tag => tag.value)
    setSelectedTags(oldValue => nameTags)
  }

  return (
    <>
      <Head>
        <title>Lançamentos em cartão por categoria | Meu Dinherim</title>
      </Head>
      <Layout>
        <Flex mb={[6, 6, 8]} justify="space-between" align="center">
          <Heading>
            <Text>Relatório de lançamentos em cartão por categoria</Text>
          </Heading>
        </Flex>

        <DateFilter
          label="Selecione um período"
          startDate={startDate}
          endDate={endDate}
          onChange={(update: [Date | null, Date | null]) => {
            setDateRange(update);
          }}
          onClick={handleDateFilter}
        />

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
          
        <Box>
          <CreditByCategoryReport tags={selectedTags}/>
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