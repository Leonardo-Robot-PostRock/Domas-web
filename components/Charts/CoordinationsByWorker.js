import { Flex, Text, Center, Spinner, Box } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import ChartComponent from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';
import { colors } from '../../constants/colors.js';

dayjs.locale('es');

const ChartCoordinationsByWorker = () => {
    const { data } = useSWR('/api/dashboard/getCoordinationsByWorker', fetcher);

    useEffect(() => {
        //console.log(data);
    }, [data]);
    
    return(
        <>
            { data?                                 
                <Box m={0} p={0}>
                    <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                        Tickets coordinados por Coordinador
                    </Text>
                    <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={2}>
                        Categorías: Todas las categorías de ST                        
                    </Text>
                    <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                        Rango de tiempo: últimos 3 meses
                    </Text>
                    
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de coordinaciones'} />
                    }
                
                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', md: '90%'}}>
                                <CoordinationsChart data={data} />
                            </Box>
                        }
                    </Flex>
                </Box>
                :
                <Center h={'75vh'}>
                    <Flex direction={'column'} alignItems={'center'} justifyContent={'center'} wrap={'wrap'}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                        <Text fontSize={'xl'} fontWeight={'semibold'} textAlign={'center'} mt={7}>
                            Cargando datos...
                        </Text>
                    </Flex>
                </Center>
            }
        </>
    )
}

const CoordinationsChart = ({ data }) => {
    let labels = data.flatMap(item => item.coordinations.map(c => dayjs(c.month).locale('es').format('MMMM')));
    labels = [...new Set(labels)];

    const dataChart = {
        labels,
        datasets: data.map((worker,i) => {
            return {
                type: 'bar',
                label: worker.worker,
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: 2,
                fill: false,
                data: worker.coordinations.map(item => Number(item.ticket_count)),
            }
        })
    };

    let ticketsTotal = data.flatMap(item => item.coordinations.map(ticket => ticket.ticket_count));
    const max = Math.max(...ticketsTotal);    
    const maxValue = max + 5;

    return(
        <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} scales={true} />
    )
}



export default ChartCoordinationsByWorker;