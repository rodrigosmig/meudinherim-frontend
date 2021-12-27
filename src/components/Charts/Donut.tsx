import { 
  Box, 
  Flex, 
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { toCurrency } from '../../utils/helpers';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface DonutChartProps {
  label: string;
  color: string;
  data:  {
    value: number,
    label: string
  }[],
}

export const DonutChart = ({ label, color, data }: DonutChartProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');

  const series = data.map(entry => {
    return entry.value;
  });

  const labels = data.map(entry => {
    return entry.label;
  });

  const chartOptions = {          
    series: series,
    options: {
      chart: {
        width: 380,
        dropShadow: {
          enabled: true,
          color: '#111',
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2
        }
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
              total: {
                showAlways: false,
                show: false
              }
            }
          }
        }
      },
      labels: labels,
      legend: {
        show: false
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return toCurrency(val)
          },
          title: {
            formatter: function (seriesName) {
              return seriesName + ":"
            }
          }
        }
      },
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8
        }
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15
          }
        }
      },
      theme: {
        palette: 'palette8',
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
    },
  };

  return (
    <Flex
      flexDir={'column'}
      w={"full"}
      mb={2}
      bg={bgColor}
      borderBottomRadius={8}
      boxShadow={'xl'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box bgColor={color} w="100%">
        <Text
          w="full"
          p={3}
          color={"white"} 
          fontWeight={'bold'}
          fontSize={['md', 'lg']}
        >
          { label }
        </Text>
      </Box> 
      <Flex
        w={['16.5rem', '30rem']}
        h={['12.5rem', 'xs']}
        p={2}
        justifyContent={'center'}
        alignItems={'center'}
      >
        { series.length === 0 ? (
          <Text
            
          >
            Nenhum Registro
          </Text>
        ) : (
          <Chart
            options={chartOptions.options} 
            series={chartOptions.series} 
            type="pie"
            height={'100%'}
          />

        )}
      </Flex>
    </Flex>
  )
} 