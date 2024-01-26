import { Flex, Text, Center, Spinner, Box, Link, Button, Tooltip, Icon } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import ChartComponent from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';
import Table from '@/components/Datatable/Table.js';
import { downloadExcel } from 'react-export-table-to-excel';
import { MdCloudDownload, MdQuestionMark } from 'react-icons/md';
import { datetimeFormatted } from "@/utils/Datetime.js";

dayjs.locale('es');


const ChartReiterados = () => {

    return(
        <Box m={0} p={0} display={'flex'} flexDirection={'column'} alignItems={'center'} w={'100%'}>
             <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} my={3} mb={7}>
                Clientes Reiterados
            </Text>
            <Tabs isLazy isFitted variant='soft-rounded' border={'1px solid #CBD5E0'} borderRadius={'20px'} colorScheme='telegram' w={'90%'}>
                <TabList mb='1em'>
                    <Tab>ST</Tab>
                    <Tab>General</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Dash categorie={'st'} />
                    </TabPanel>
                    <TabPanel>
                        <Dash categorie={'all'} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

const Dash = ({categorie}) => {
    const [dataTable, setDataTable] = useState(null);
    const { data, isLoading } = useSWR(`/api/dashboard/getRecurrentClientsData?categories=${categorie}`, fetcher);
    let mesaCategories;

    if(categorie == 'st') {
        mesaCategories = ['SIN INTERNET','SIN INTERNET FO', 'ANTI-BAJA SERVICIO TÉCNICO', 'VELOCIDAD', 'VELOCIDAD FO', 
        'CLIENTE PIDE TÉCNICO', 'SIN INTERNET - SANTA TERESITA', 'REDIRECCIONAR', 'WIFI HOME', 'ROUTER - CONF. ROUTER', 
        'CAMBIO DE VELOCIDAD', 'CAMBIO DE VELOCIDAD FIBRA', 'MOVIMIENTO DE CPE', 'MICROCORTES FO', 'MICROCORTES WIRELESS'];
    }
    else {
        mesaCategories = ['SIN INTERNET','SIN INTERNET FO', 'ANTI-BAJA SERVICIO TÉCNICO', 'VELOCIDAD', 'VELOCIDAD FO', 
        'CLIENTE PIDE TÉCNICO', 'SIN INTERNET - SANTA TERESITA', 'REDIRECCIONAR', 'WIFI HOME', 'ROUTER - CONF. ROUTER', 
        'CAMBIO DE VELOCIDAD', 'CAMBIO DE VELOCIDAD FIBRA', 'MOVIMIENTO DE CPE', 'MICROCORTES FO', 'MICROCORTES WIRELESS',
        'GARANTIA INSTALACION FO', 'POR GARANTIA INSTALACION', 'GARANTIA DE SERVICIO TECNICO', 'FCR CALL TÉCNICO',
        'INSTALACIONES','INSTALACIONES FIBRA','INSTALACIONES FIBRA DECIMO','INSTALACIONES EXTENSIBLE']
    }

    useEffect(() => {
        if (data && !data?.error){
            let dataTableClients = [];
            let dataAux = JSON.parse(JSON.stringify(data));

            dataAux.sort((a, b) => b.tickets_quantity - a.tickets_quantity)
            dataAux.forEach(item => {
                dataTableClients = dataTableClients.concat(item.clients);
            });

            setDataTable(dataTableClients);
        }
    }, [data]);

    let columns = [
        {
            name: 'Código de cliente',
            selector: row => row.codigo_cliente,
            sortable: true,
        },
        {
            name: 'Tickets reiterados',
            selector: row => Number(row.tickets_reiterados),
            sortable: true,
        },
        {
            name: 'Link Mesa',
            cell: row => <Link color={'#009999'} href={`http://mesa.westnet.com.ar/ticket#codigo_cliente.${row.codigo_cliente}`} isExternal>Ver en Mesa</Link>,
            sortable: false
        }
    ]

    const handleDownloadExcel = () => {
        
        downloadExcel({
            fileName: `Clientes Reiterados_${categorie == 'all'? 'gral' : 'st'}_${datetimeFormatted(new Date(), 'DD-MM-YYYY')}`,
            sheet: 'Reiterados',
            tablePayload: {
                header: ['Código de cliente', 'Cantidad de tk reiterados', 'Tickets'],
                body: dataTable
            }
        });
    }
    
    return(
        <>
            { data?                                 
                <Box m={0} p={0}>   
                    <Flex alignItems={'center'} justifyContent={'center'} mb={5} >
                        <Text fontSize={'md'} fontWeight={'medium'} >
                            Categorías: {categorie == 'all'? 'todas las categorías de ST, Instalaciones y Garantías' : 'todas las categorías de ST'}
                        </Text>
                        <Tooltip label={mesaCategories.join(', ')} placement={'top'}>
                            <span>
                                <Icon as={MdQuestionMark} ml={3} boxSize={4} bg={'white'} rounded={'full'} border={'1px solid black'}/>
                            </span>
                        </Tooltip>
                    </Flex>                
                    
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de clientes reiterados.'} />
                    }

                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' my={3} p={5} backgroundColor={'white'} borderRadius={'lg'} w={'100%'}>
                                <ClientsChart data={data} />
                            </Box>
                        }
                    </Flex>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} mt={5} >
                        <Flex flexDir={'row'} gap={4} justifyContent={'space-between'} w={{base: '100%', md: '70%'}} bg={'white'} pt={4} px={5} rounded={'md'}>
                            <Text fontSize={'30px'} fontWeight={'semibold'} color={'teal.500'}>
                                CLIENTES
                            </Text>
                            <Button width='250px' size='sm' colorScheme='teal' leftIcon={<MdCloudDownload/>} onClick={handleDownloadExcel}> Descargar Reporte </Button>
                        </Flex>
                        { dataTable?.length > 0 &&
                            <Table 
                                columns={columns} 
                                data={dataTable} 
                                isLoading={isLoading} 
                                title={''} 
                                containerWidth={{base: '100%', md: '70%'}}                                     
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

const ClientsChart = ({ data }) => {

    const labels = data.map(item => item.tickets_quantity);
    const dataChart = {
        labels,
        datasets: [            
            {
                type: 'bar',
                label: 'Clientes con tickets reiterados',
                backgroundColor: 'rgb(51, 153, 255)',
                data: data.map(item => item.clients.length),
                datalabels: {
                    align: 'end',
                    anchor: 'end'
                },                
            },
        ],
    };

    const maxValue = Math.max(...data.map(item => item.clients.length));    

    return(
        <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} scales={true} />
    )
}



export default ChartReiterados;