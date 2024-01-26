import { Flex, Text, Center, Spinner, Box } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';
import Table from '@/components/Datatable/Table.js';

dayjs.locale('es');

const ClustersStatus = () => {
    const [clusterData, setClusterData] = useState(null);
    const { data, isLoading } = useSWR('/api/dashboard/getClustersStatus', fetcher);

    let columns = [
        {
            name: 'Cluster',
            selector: row => parseInt(row.cluster),
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Cantidad de Técnicos</Text>,
            selector: row => row.teams.reduce((acc, curr) => {
                        curr.technicians.forEach(technician => {
                            acc.push(technician);
                        });
                        return acc;
                    }, []).length ?? 0,
            sortable: true,
            compact: true,
        },
        {
            name: 'Técnicos',
            selector: row => row.technicians,
            cell: row => <Text fontSize={'13'}>{row.technicians}</Text>,
            sortable: false
        },
        {
            name: <Text align={'center'}>Equipo asignado</Text>,
            selector: row => row.assignated_team,
            sortable: true,
            compact: true,
        },
        {
            name: 'Refuerzo',
            selector: row => row.teams.find(team => team.id !== row.assignated_team_id)?.team ?? '-',
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Resolución diaria estimada</Text>,
            selector: row => row.resolution_capacity,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Tickets abiertos</Text>,
            selector: row => row.open_tickets,
            cell: row => (<Text 
                            fontSize={'sm'} 
                            px={3}
                            py={2}
                            bg={row.average_resolution_time == 1? '#47d147' : row.average_resolution_time == 2? 'yellow' : row.average_resolution_time == 3? '#ff471a' : 'black'}
                            color={row.average_resolution_time > 3? 'white' : 'black'}
                            >
                            {row.open_tickets}
                        </Text>),
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Tiempo promedio de resolución (dias)</Text>,
            selector: row => row.average_resolution_time,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Menos de 24hs</Text>,
            selector: row => row.one_day,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Entre 24 y 48hs</Text>,
            selector: row => row.two_days,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Entre 48 y 72hs</Text>,
            selector: row => row.three_days,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Entre 72 y 96hs</Text>,
            selector: row => row.four_days,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}>Más de 96hs</Text>,
            selector: row => row.more_than_four_days,
            sortable: true,
            compact: true,
        },
        {
            name: <Text align={'center'}> Tiempo promedio de tk abiertos (días) </Text>,
            selector: row => parseFloat(row.average_open_time),
            sortable: true,
            compact: true,
        }
    ];

    useEffect(() => {
        if (data && data.length > 0){
            let clusters = data.map(cluster => {
                let teams = cluster.teams.map(team => {
                    let technicians = team.technicians.map(technician => {
                        return technician.name;
                    }).join(', ');

                    return `${technicians} (${team.team})`;
                }).join(', ');

                return {
                    ...cluster,
                    technicians: teams,
                    assignated_team: cluster.teams.find(team => team.id === cluster.assignated_team_id)?.team ?? '-',
                }
            });
            setClusterData(clusters);
        }
    }, [data]);

    return(
        <>
        { data?
            <Box w={'100%'} h={'100%'} p={4}>
                <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                    Estado actual de los Clusters
                </Text>
                <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={2}>
                    Categorías: Sin Internet, Sin Internet FO, Sin Internet - Santa Teresita, Anti-Baja ST
                </Text>

                { data?.error &&
                    <BoatError title={'Ocurrió un error al intentar mostrar dashboard de clientes reiterados.'} />
                }
                <Box display={'flex'} justifyContent={'center'} mt={5} >
                    { clusterData &&
                        <Table 
                            columns={columns} 
                            data={clusterData} 
                            isLoading={isLoading} 
                            title={''} 
                            containerWidth={'100%'}    
                            tableHeight={'80vh'}                                 
                        />
                    }
                </Box>                
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

export default ClustersStatus;