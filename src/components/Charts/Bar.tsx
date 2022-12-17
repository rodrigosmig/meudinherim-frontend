import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { toCurrency } from '../../utils/helpers';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface Props {
  label: string;
  months: string[];
  data: {
    income: number[];
    expense: number[];
  }  
}

export const BarChart = ({ label, months, data }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const { colorMode } = useColorMode();

  const options = {
    series: [{
      name: 'Entradas',
      data: data?.income
    }, {
      name: 'Saídas',
      data: data?.expense
    }],
    options: {
      colors: ['#3182CE','#E53E3E'],
      chart: {
        background: bgColor,
        toolbar: {
          show: false,
          tools:{
            download: false
          }
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      theme: {
        mode: colorMode
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: months,
      },
      yaxis: {
        title: {
          text: 'R$'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return toCurrency(val)
          }
        }
      },
      responsive: [{
        breakpoint: 300,
        options: {
          chart: {
            width: 290
          },
          legend: {
            position: 'top'
          }
        }
      }]
    }
  }

  return (
    <Flex
      flexDir={'column'}
      borderBottomRadius={8}
      boxShadow={'xl'}
      justifyContent={'center'}
      alignItems={'center'}
      bg={bgColor}
    >
      <Box w="100%">
        <Text
          width="full"
          p={3}
          fontWeight={'bold'}
          fontSize={['md', 'lg']}
          textAlign="center"
        >
          { label }
        </Text>
      </Box> 
      <Flex
        width={['full']}
        height={['12.5rem', 'xs']}
        justifyContent={'center'}
        alignItems={'center'}
        mb={4}
        px={4}
      >
        <Box
          width={['full']}
          height={["full"]}
        >
        <Chart 
          options={options.options} 
          series={options.series} 
          type="bar"
          width='100%'
          height="100%"
        />
        </Box>
      </Flex>
    </Flex>
  )
}