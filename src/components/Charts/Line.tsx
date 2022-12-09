import {
  Box,
  Flex,
  Text,
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
  series: {
    name: string;
    data: number[];
  }[]
}

type CurveType = "smooth" | "straight" | "stepline"

export const LineChart = ({ label, months, series }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const { colorMode } = useColorMode();
  const curve: CurveType = "smooth";

  const options = {
    series: series,
    options: {
      chart: {
        background: bgColor,
        toolbar: {
          show: false,
          tools:{
            download: false
          }
        },
      },
      theme: {
        mode: colorMode
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: curve
      },
      markers: {
        size: 4
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
          w="full"
          p={3}
          fontWeight={'bold'}
          fontSize={'lg'}
          textAlign="center"
        >
          { label }
        </Text>
      </Box> 
      <Flex
        w={['full']}
        h={['12.5rem', 'xs']}
        justifyContent={'center'}
        alignItems={'center'}
        mb={4}
        p={4}
      >
        <Chart 
          options={options.options} 
          series={options.series} 
          type="line"
          width="100%"
          height="100%"
        />
      </Flex>
    </Flex>
  )
}