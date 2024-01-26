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

const ChartCloseTk = () => {
    const [dashAllClustersWithRecurrents, setDashAllClustersWithRecurrents] = useState(null);
    const { data } = useSWR('/api/dashboard/getSTCloseTicketsData', fetcher);

    useEffect(() => {
        if(data && !data?.error) {
            let labels = data[0].clients.map(item => item.month);
            let dashAllClusters = data.map(item => {
                return {
                    cluster: item.cluster,
                    clients: item.clients.map(client => {
                        return {
                            month: client.month,
                            reiterados: client.reiterados,
                            porcentaje_reiterados: client.porcentaje_reiterados,
                        }
                    }),
                    labels: labels
                }
            });

            setDashAllClustersWithRecurrents(dashAllClusters);
        }
    }, [data]);


    return(
        <>
            { data?                                 
                <Box m={0} p={0}>
                    <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                        Tickets cerrados por cluster con reiterados
                    </Text>
                    <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                        Categorías: Sin Internet, Sin Internet FO, Anti-Baja ST, Sin internet - Santa Teresita
                    </Text>
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de tickets cerrados'} />
                    }

                    { !data?.error && dashAllClustersWithRecurrents &&
                        <Center>
                            <Box boxShadow='lg' my={3} p={2} backgroundColor={'white'} borderRadius={'lg'} w={'97%'}>
                                <Text mb={2}> Clientes Reiterados por Cluster </Text>
                                <AllClustersChart data={dashAllClustersWithRecurrents} />
                            </Box>
                        </Center>
                    }
                
                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            data.map((item, i) => {
                                return (
                                    <Box boxShadow='lg' key={i} my={3} p={2} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '48%'}}>
                                        <Text mb={2}> Cluster {item.cluster} </Text>
                                        <ClusterChart data={item.clients} />
                                    </Box>
                                )
                            })
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

const ClusterChart = ({ data }) => {
    const labels = data.map(item => dayjs(item.month).locale('es').format('MMMM').toUpperCase());
    const dataChart = {
        labels,
        datasets: [
            {
                type: 'line',
                label: '% Cerrados 48hs',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                data: data.map(item => Number(item.porcentaje_cerrados_48hs)),
                datalabels: {
                    align: 'end',
                    anchor: 'end'
                }
            },
            {
                type: 'line',
                label: '% Reiterados',
                borderColor: 'rgb(0, 153, 153)',
                backgroundColor: 'rgb(0, 153, 153)',
                borderWidth: 2,
                fill: false,
                data: data.map(item => Number(item.porcentaje_reiterados)),
                datalabels: {
                    align: 'end',
                    anchor: 'end'
                }
            },
            {
                type: 'bar',
                label: 'Tickets cerrados',
                backgroundColor: 'rgb(153, 204, 255)',
                data: data.map(item => Number(item.tickets_cerrados)),
                datalabels: {
                    align: 'end',
                    anchor: 'end'
                }
            },
        ],
    };

    const maxValue = Math.max(...data.map(item => Number(item.tickets_cerrados))) + 15;
    

    return(
        <ChartComponent data={dataChart} suggestedMax={maxValue > 100? maxValue : 110} stacked={false} scales={true} />
    )
}

const AllClustersChart = ({ data }) => {
    const labels = data[0].labels;
    
    const dataChart = {
        labels: labels.map(item => dayjs(item).locale('es').format('MMMM').toUpperCase()),
        datasets: data.map((item,i) => {
            return {
                type: 'bar',
                label: `Cluster ${item.cluster}`,
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: 2,
                fill: false,
                data: item.clients.map(client => Number(client.reiterados))
            }
        })
    };

    const maxValue = Math.max(...data.map(item => Number(item.reiterados))) + 15;

    return(
        <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} interactionMode={'x'} scales={true} />
    )
}

export default ChartCloseTk;