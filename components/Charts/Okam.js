import { Flex, Text, Center, Spinner, Box, Link, Button, Tooltip, Icon } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import ChartComponent from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';

dayjs.locale('es');


const ChartOkam = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return(
        <Box m={0} p={0} display={'flex'} flexDirection={'column'} alignItems={'center'} w={'100%'}>
            <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                Tickets verificados por Okam
            </Text>
            <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={2}>
                Categorías: Todas las categorías de ST                        
            </Text>
            <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                { tabIndex === 0 ?
                    'Rango de tiempo: mes en curso'
                    :
                    'Rango de tiempo: 6 meses'
                }
            </Text>
            
            <Tabs isLazy isFitted variant='soft-rounded' border={'1px solid #CBD5E0'} borderRadius={'20px'} colorScheme='telegram' w={'90%'} onChange={(index) => setTabIndex(index)}>
                <TabList mb='1em'>
                    <Tab>Diario</Tab>
                    <Tab>Mensual</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Dash months={1} />
                    </TabPanel>
                    <TabPanel>
                        <Dash months={6} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

const Dash = ({months}) => {
    const [dataChart, setDataChart] = useState(null);
    const [maxValue, setMaxValue] = useState(100);
    const { data, isLoading } = useSWR(`/api/dashboard/getOkamVerifieds?months=${months}`, fetcher);

    useEffect(() => {
        if (data && !data.error) {
            const dataAux = data.data;
            
            if (dataAux[0].day){
                dataAux.sort((a, b) => a.day.localeCompare(b.day));
            }

            const dataC = {
                labels: dataAux.map(item => {
                    if(item.day) {
                        return parseInt(item.day)
                    }
                    else {
                        return dayjs(item.month).locale('es').format('MMMM').toUpperCase()
                    }
                }),
                datasets: [
                    {
                        type: 'line',
                        label: '% Verificados',
                        borderColor: 'rgb(76, 230, 0)',
                        backgroundColor: 'rgb(76, 230, 0)',
                        borderWidth: 2,
                        fill: false,
                        data: dataAux.map(item => item.average),
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    },
                    {
                        type: 'bar',
                        label: 'Tk Cerrados',
                        backgroundColor: 'rgb(153, 187, 255)',
                        data: dataAux.map(item => item.ticketsClosed),
                        datalabels: {
                            align: 'end',
                            anchor: 'center'
                        }
                    },
                    {
                        type: 'bar',
                        label: 'Tk Verificados',
                        backgroundColor: 'rgb(0, 153, 51)',
                        data: dataAux.map(item => item.ticketsVerified),
                        datalabels: {
                            align: 'end',
                            anchor: 'center'
                        }
                    }
                ]
            };

            const max = Math.max(...dataAux.map(item => Math.max(item.ticketsClosed, item.ticketsVerified))); 

            if(max > maxValue){
                setMaxValue(max);
            }

            setDataChart(dataC);
        }
    }, [data]);

    return(
        <>
            { data?
                <Box m={0} p={0}>
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de problemas frecuentes.'} />
                    }
                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { dataChart &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={'90%'} alignSelf={'center'}>                    
                                <Text mb={2} fontSize={20} fontWeight={'medium'}> {months == 1? 'Tickets Por Día' : 'Tickets Por Mes'} </Text>                                    

                                <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} scales={true}/>
                            </Box>
                        }
                        { !data?.error && data?.data.length === 0 &&
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

export default ChartOkam;