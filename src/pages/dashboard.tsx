import Head from "next/head";
import { setupApiClient } from '../services/api';
import { withSSRAuth } from '../utils/withSSRAuth';
import { Layout } from '../components/Layout';
import { Stats } from "../components/Stats";
import { 
  Box, 
  Button, 
  Flex, 
  IconButton, 
  SimpleGrid, 
  Text, 
} from "@chakra-ui/react";
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaMoneyBillAlt, FaCreditCard } from 'react-icons/fa'
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { DonutChart } from "../components/Charts/Donut";
import { BarChart } from "../components/Charts/Bar";
import { useDashboard } from "../hooks/useDashboard";
import { LoadingStats } from "../components/LoadingStats";
import { LoadingDonutChart } from "../components/LoadingDonutChart";
import { LineChart } from "../components/Charts/Line";
import { LoadingBarChart } from "../components/LoadingBarChart";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { addMonths, format, getYear, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toUsDate } from "../utils/helpers";
import { useState } from "react";

export default function Dashboard() {
  const incomeColor = "blue.500";
  const expenseColor = "red.500";
  const balanceColor = "green.500";
  const cardColor = "yellow.400";
  
  const [date, setDate] = useState(new Date());

  const { data, isLoading} = useDashboard(toUsDate(date));

  const month = format(date, 'LLLL', { locale: ptBR });
  const year = getYear(date);

  const handlePreviousMonth = () => {
    const newDate = subMonths(date, 1);
    setDate(newDate);
  }

  const handleNextMonth = () => {
    const newDate = addMonths(date, 1);
    setDate(newDate);
  }

  return (
    <>
      <Head>
        <title>Dashboard | Meu Dinherim</title>
      </Head>

      <Layout isDashboard>
        <Flex
          fontWeight={"bold"}
          fontSize={[28]}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text textTransform={"capitalize"}>{month}, {year}</Text>
          <Box>
            <IconButton
              aria-label="Previous month"
              icon={<IoIosArrowBack />}
              onClick={handlePreviousMonth}
            />
            <IconButton
              ml={[2]}
              aria-label="Next month"
              icon={<IoIosArrowForward />} 
              onClick={handleNextMonth}
            />
          </Box>
        </Flex>
          { isLoading ? (
            <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={4}>
              <LoadingStats color={incomeColor} />
              <LoadingStats color={expenseColor} />
              <LoadingStats color={balanceColor} />
              <LoadingStats color={cardColor} />
            </SimpleGrid>
          ) : (
          <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={4}>
            <Stats
              label={'Entradas'}
              amount={data.total.income}
              icon={FiArrowUp}
              color={incomeColor}
            />
            <Stats 
              label={'Saidas'}
              amount={data.total.expense}
              icon={FiArrowDown}
              color={expenseColor}
            />

            <Stats 
              label={'Saldo'}
              amount={data.total.income - data.total.expense}
              icon={FaMoneyBillAlt}
              color={balanceColor}
            />

            <Stats
              label={'Cartão de Crédito'}
              amount={data.total.invoices}
              icon={FaCreditCard}
              color={cardColor}
            />
          </SimpleGrid>
        )}

        <Card 
          mt={6} 
          boxShadow={'xl'}
        >
          <Heading borderBottom={"1px"} mb={4} pb={4}>
            Movimentação por Categoria (%)
          </Heading>

          { isLoading ? (
            <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={4}>
              <LoadingDonutChart label="Entradas" color={incomeColor} />
              <LoadingDonutChart label="Saidas" color={expenseColor} />
              <LoadingDonutChart label="Cartão de Crédito" color={cardColor} />
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={4}>
              <DonutChart
                label="Entradas"
                color={incomeColor} 
                data={data.pieChart.income_category}
              />
              <DonutChart
                label="Saidas"
                color={expenseColor}
                data={data.pieChart.expense_category}
              />
              <DonutChart
                label="Cartão de Crédito"
                color={cardColor}
                data={data.pieChart.card_expense_category}
              />
            </SimpleGrid>
          )}

        </Card>

        <Card
          mt={6} 
          boxShadow={'xl'}
        >
          <Heading borderBottom={"1px"} mb={4} pb={4}>
            Últimos seis meses
          </Heading>

          { isLoading ? (
            <SimpleGrid columns={[1, 2]} spacing={4}>
              <LoadingBarChart label="Contas" />
              <LoadingBarChart label="Cartão de Crédito" />
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={[1, 2]} spacing={4}>
              <BarChart 
                label="Contas"
                months={data.months}
                data={data.barChart}
              />

              <LineChart 
                label="Cartão de Crédito"
                months={data.months}
                series={data.lineChart.invoices}
              />
            </SimpleGrid>
          )}
        </Card>

      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/auth/me');

  return {
    props: {}
  }
})
