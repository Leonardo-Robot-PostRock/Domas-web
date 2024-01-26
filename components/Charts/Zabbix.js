import { Flex, Text, Center, Spinner, Box, Link, Button, Tooltip, Icon, Select } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import ChartComponent from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';

dayjs.locale('es');


const ChartZabbix = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [company, setCompany] = useState('westnet');

    return(
        <Box m={0} p={0} display={'flex'} flexDirection={'column'} alignItems={'center'} w={'100%'}>
            <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                Clientes Offline y Preventivos
            </Text>
            <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                Rango de tiempo: mes en curso
            </Text>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mb={5} gap={3}>
                <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'}>
                    Empresa:
                </Text>
                <Select bg={'white'} defaultValue={'westnet'} onChange={(e) => setCompany(e.target.value)}>
                    <option value={'westnet'}>Westnet</option>
                    <option value={'bigway'}>Bigway</option>
                </Select>
            </Box>
            
            
            <Tabs isLazy isFitted variant='soft-rounded' border={'1px solid #CBD5E0'} borderRadius={'20px'} colorScheme='telegram' w={{base: '100%', md: '90%'}} onChange={(index) => setTabIndex(index)}>
                <TabList mb='1em'>
                    <Tab>Wireless</Tab>
                    <Tab>FTTH</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Dash tech={'wireless_customers'} company={company} />
                    </TabPanel>
                    <TabPanel>
                        <Dash tech={'ftth_customers'} company={company} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

const Dash = ({tech, company}) => {
    const [dataChart, setDataChart] = useState(null);
    const [dataClusters, setDataClusters] = useState(null);
    const [maxValue, setMaxValue] = useState(null);
    const { data, isLoading } = useSWR(`/api/dashboard/getOffline&PreventiveCustomers?tech=${tech}&company=${company}`, fetcher);

    useEffect(() => {
        setDataClusters(null);
        if (data && !data.error) {
            const dataC = {
                labels: data.map(item => {
                    if(item.date) {
                        let day = item.date.split('-')[2];
                        return parseInt(day);
                    }
                    else {
                        return dayjs(item.month).locale('es').format('MMMM').toUpperCase()
                    }
                }),
                datasets: [
                    {
                        type: 'line',
                        label: 'Offline',
                        borderColor: 'rgb(204, 0, 0)',
                        backgroundColor: 'rgb(204, 0, 0)',
                        borderWidth: 2,
                        fill: false,
                        data: data.map(item => item.avgOffline),
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    },
                    {
                        type: 'line',
                        label: 'Preventivos',
                        borderColor: 'rgb(255, 153, 51)',
                        backgroundColor: 'rgb(255, 153, 51)',
                        borderWidth: 2,
                        fill: false,
                        data: data.map(item => item.avgPreventive),
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    },
                ]
            };

            if (company === 'westnet') {
                data.forEach(date => {
                    // Asegurar que todos los clusters estén presentes y asignar valor 0 si no lo está
                    for (let i = 0; i < 14; i++) {
                        if (!date.offlineClustersAvg.hasOwnProperty(i.toString())) {
                            date.offlineClustersAvg[i.toString()] = 0;
                        }
                    }
                    // Ordenar el objeto por clave
                    const sortedOfflineClustersAvg = Object.fromEntries(
                        Object.entries(date.offlineClustersAvg).sort(([a], [b]) => Number(a) - Number(b))
                    );
    
                    date.offlineClustersAvg = sortedOfflineClustersAvg;
    
                    for (let i = 0; i < 14; i++) {
                        if (!date.preventiveClustersAvg.hasOwnProperty(i.toString())) {
                            date.preventiveClustersAvg[i.toString()] = 0;
                        }
                    }
    
                    const sortedPreventiveClustersAvg = Object.fromEntries(
                        Object.entries(date.preventiveClustersAvg).sort(([a], [b]) => Number(a) - Number(b))
                    );
                    
                    date.preventiveClustersAvg = sortedPreventiveClustersAvg;
                });

                let dataCluster = [];

                for (let i = 0; i < 14; i++) {
                    let c = {
                        labels: dataC.labels,
                        datasets: [
                            {
                                type: 'line',
                                label: `Offline Cluster ${i}`,
                                borderColor: 'rgb(204, 0, 0)',
                                backgroundColor: 'rgb(204, 0, 0)',
                                borderWidth: 2,
                                fill: false,
                                data: data.map(item => item.offlineClustersAvg[i.toString()]),
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end'
                                }
                            },
                            {
                                type: 'line',
                                label: `Preventivo Cluster ${i}`,
                                borderColor: 'rgb(255, 153, 51)',
                                backgroundColor: 'rgb(255, 153, 51)',
                                borderWidth: 2,
                                fill: false,
                                data: data.map(item => item.preventiveClustersAvg[i.toString()]),
                                datalabels: {
                                    align: 'end',
                                    anchor: 'end'
                                }
                            }
                        ]
                    }
                    dataCluster.push(c);
                }

                setDataClusters(dataCluster);
            }            

            const max = Math.max(...data.map(item => item.avgPreventive)); 

            company === 'westnet' ? setMaxValue(max + 50) : setMaxValue(max + 5);

            setDataChart(dataC);
        }
    }, [data]);

    return (
        <>
            { data?
                <Box m={0} p={0}>
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de problemas frecuentes.'} />
                    }
                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { dataChart &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', md: '90%'}} alignSelf={'center'}>                    
                                <Text mb={2} fontSize={20} fontWeight={'medium'}> {tech == 'wireless_customers'? 'Clientes Wireless' : 'Clientes FTTH'} </Text>                                    

                                <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} scales={true}/>
                            </Box>
                        }
                        { /* !data?.error && data?.data.length === 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '75%', xl: '55%'}} alignSelf={'center'}>
                                { dayjs().format('D') == 1 ?
                                    <Text fontSize={17} fontWeight={'medium'} textAlign={'center'} color={'#5B6BFF'} mt={5}> Bienvenido al comienzo de un nuevo mes! <br/> Aún no hay datos para mostrar. </Text>
                                    :
                                    <Text fontSize={17} fontWeight={'medium'} textAlign={'center'} color={'#5B6BFF'} mt={5}> No se encontraron datos para mostrar </Text>
                                }
                                <Image src='/images/no_data.png' alt='No data found' mx={'auto'} w={'60%'} p={10}/>
                                <Box display={'flex'} justifyContent={'end'}>
                                    <small style={{color: '#bfbfbf'}}>Image by <a href="https://www.freepik.com/free-vector/flat-design-no-data-illustration_47718912.htm#query=no%20data&position=7&from_view=keyword&track=ais">Freepik</a></small>
                                </Box>
                            </Box> */
                        }
                        { dataClusters &&
                            dataClusters.map((item, index) => (
                                <Box key={index} boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', md: '45%'}} alignSelf={'center'}>
                                    <Text mb={2} fontSize={20} fontWeight={'medium'}> Cluster {index} </Text>
                                    <ChartComponent data={item} stacked={false} scales={true}/>
                                </Box>
                            ))
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


const ClusterDash = () => {

    return {

    }
}

export default ChartZabbix;