import { Flex, Text, Center, Spinner, Box, Button, Tooltip, Checkbox, Tabs, TabList, Tab, TabPanels, TabPanel, Image, Input, Radio, RadioGroup } from "@chakra-ui/react";
import { useState, useEffect, useRef, createContext } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ChartComponent, { CustomPieChart } from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';
import { colors } from '../../constants/colors.js';
import { getElementAtEvent } from 'react-chartjs-2';
import { MdAutorenew } from 'react-icons/md';
import MapComponent from "../Map.js";


dayjs.locale('es');
dayjs.extend(customParseFormat);

const ChartRefContextMC = createContext();
const ChartRefContextP = createContext();
const ChartRefContextC = createContext();
const ChartRefContextS = createContext();

const ChartProblemasFrecuentes = () => {
    const [dateInterval, setDateInterval] = useState({
        start: dayjs().date(1).format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
    });
    const [fromDate, setFromDate] = useState(dateInterval.start);
    const [toDate, setToDate] = useState(dateInterval.end);
    const [tabIndex, setTabIndex] = useState(0);

    return(
        <Box m={0} p={0} display={'flex'} flexDirection={'column'} alignItems={'center'} w={'100%'}>
            <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                Problemas frecuentes
            </Text>
            <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={2}>
                Categorías: Sin Internet, Sin Internet FO, Sin internet - Santa Teresita, Anti-Baja ST                        
            </Text>
            <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                { tabIndex !== 2 ?
                    'Rango de tiempo inicial: mes en curso'
                    :
                    'Rango de tiempo: 6 meses'
                }
            </Text>
            {   tabIndex !== 2 &&
                <Flex direction={{base: 'column', lg: 'row'}} alignItems={{base: 'center', lg: 'end'}} justifyContent={'center'} gap={10} w={'50%'} mb={7}>
                    <Flex direction={'row'} alignItems={'center'}>
                        <Text mr={4}>Desde:</Text>
                        <Input type={'date'} value={fromDate} bg={'whiteAlpha'} onChange={(e) => setFromDate(e.target.value)} />
                    </Flex>
                    <Flex direction={'row'} alignItems={'center'}>
                        <Text mr={4}>Hasta:</Text>
                        <Input type={'date'} value={toDate} bg={'whiteAlpha'} onChange={(e) => setToDate(e.target.value)} />
                    </Flex>
                    <Button colorScheme="telegram" onClick={() => setDateInterval({start: fromDate, end: toDate})}> Filtrar </Button>
                </Flex>
            }
            <Tabs isLazy isFitted variant='soft-rounded' border={'1px solid #CBD5E0'} borderRadius={'20px'} colorScheme='telegram' w={'90%'} onChange={(index) => setTabIndex(index)}>
                <TabList mb='1em'>
                    <Tab>General</Tab>
                    <Tab>Clientes Reiterados</Tab>
                    <Tab>Evolución Temporal</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Dash recurrent={false} dateInterval={dateInterval} />
                    </TabPanel>
                    <TabPanel>
                        <Dash recurrent={true} dateInterval={dateInterval} />
                    </TabPanel>
                    <TabPanel>
                        <EvolutionChart />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

const Dash = ({recurrent, dateInterval}) => {
    const [wirelessTech, setWirelessTech] = useState(true);
    const [foTech, setFoTech] = useState(true);

    const [auxData, setAuxData] = useState(null);
    const [filteredDataMC, setFilteredDataMC] = useState(null);
    const [filteredDataP, setFilteredDataP] = useState(null);
    const [filteredDataC, setFilteredDataC] = useState(null);
    const [filteredDataS, setFilteredDataS] = useState(null);
    const [dataChartMC, setDataChartMC] = useState(null);
    const [dataChartP, setDataChartP] = useState(null);
    const [dataChartC, setDataChartC] = useState(null);
    const [dataChartStockType, setDataChartStockType] = useState(null);
    const [main_category, setMainCategory] = useState(null);
    const [problem, setProblem] = useState(null);
    const [cause, setCause] = useState(null);
    const [stock, setStock] = useState(null);
    const [totalCasesMC, setTotalCasesMC] = useState(0);
    const [totalCasesP, setTotalCasesP] = useState(0);
    const [totalCasesC, setTotalCasesC] = useState(0);
    const [markersMC, setMarkersMC] = useState(null);
    const [markersP, setMarkersP] = useState(null);
    const [markersC, setMarkersC] = useState(null);
    const [markersS, setMarkersS] = useState(null);

    const { data, isLoading } = useSWR(`/api/dashboard/getServiceLogs?recurrent=${recurrent}&fromDate=${dateInterval.start}&toDate=${dateInterval.end}`, fetcher);

    const chartRefMC = useRef();
    const chartRefP = useRef();
    const chartRefC = useRef();
    const chartRefS = useRef();
    const chartRefPToScrollDown = useRef();
    const chartRefCToScrollDown = useRef();

    const onChartClick = (event, dataKey) => {
        let activePoints, selected;
        
        if(dataKey == 'main_category'){
            activePoints = getElementAtEvent(chartRefMC.current, event);
        }
        else if(dataKey == 'problem'){
            activePoints = getElementAtEvent(chartRefP.current, event);
        }
        else if(dataKey == 'cause'){
            activePoints = getElementAtEvent(chartRefC.current, event);
        }
        else {
            activePoints = getElementAtEvent(chartRefS.current, event);
        }
        
        if (activePoints.length > 0) {
            const clickedElementIndex = activePoints[0].index;
            
            if (dataKey == 'main_category') {
                selected = filteredDataMC[clickedElementIndex];
                setMainCategory(selected.main_category);
                setProblem(null);
                setCause(null);
                setStock(null);
                setDataChartStockType(null);

                filterData('problem', selected);
                chartRefPToScrollDown?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

                if(selected.main_category.toLowerCase() == 'router' || selected.main_category.toLowerCase() == 'onu' || selected.main_category.toLowerCase() == 'drop') {
                    renderStockChart(selected.main_category.toLowerCase(), selected.tickets);
                }
            }
            else if (dataKey == 'problem') {
                selected = filteredDataP[clickedElementIndex];
                setProblem(selected.problem);
                setCause(null);
                setStock(null);

                filterData('cause', selected);
                setTimeout(() => {
                    chartRefCToScrollDown?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            else if (dataKey == 'cause') {
                selected = filteredDataC[clickedElementIndex];
                setCause(selected.cause);
                setStock(null);
            }
            else {
                selected = filteredDataS[clickedElementIndex];
                selected.drop? setStock(selected.drop) : 
                        selected.onu? setStock(selected.onu) : 
                            selected.router? setStock(selected.router) : setStock(null);
            }
            
            seedGeoMarkers(selected.tickets, dataKey);
        }        
    }

    const resetChartData = (datakey) => {
        renderChart(auxData, 'main_category');
        renderChart(auxData, 'problem');
        setMainCategory(null);
        setProblem(null);
        setCause(null);
        setStock(null);
        setDataChartC(null);
        setDataChartStockType(null);
        setTotalCasesMC(auxData.length);
        setTotalCasesP(auxData.length);
        setTotalCasesC(null);
        setMarkersMC(null);
        setMarkersP(null);
        setMarkersC(null);
        setMarkersS(null);
    }

    const handleCheckbox = (event) => {
        const { value, checked } = event.target;

        value == 'W' ? setWirelessTech(checked) : setFoTech(checked);

        if(!checked){
            let data = auxData.filter(ticket => ticket.technology != value);
            setTotalCasesMC(data.length);
            setTotalCasesP(data.length);
            renderChart(data, 'main_category');
            renderChart(data, 'problem');
        }
        else {
            if ((value == 'W' && foTech) || (value == 'FO' && wirelessTech)) {
                setTotalCasesMC(auxData.length);
                setTotalCasesP(auxData.length);
                renderChart(auxData, 'main_category');
                renderChart(auxData, 'problem');
            }
            else {
                let data = auxData.filter(ticket => ticket.technology == value);
                setTotalCasesMC(data.length);
                setTotalCasesP(data.length);
                renderChart(data, 'main_category');
                renderChart(data, 'problem');
            }
        }
    }

    const renderChart = (datachart, dataKey) => {
        let result, labels;

        let dataByKey = datachart.reduce((acc, item) => {
            acc[item[dataKey]] = acc[item[dataKey]] || [];
            acc[item[dataKey]].push(item);
            return acc;
        }, {});

        result = Object.keys(dataByKey).map(key => {
            return {
                [dataKey]: key,
                tickets: dataByKey[key]
            }
        });

        labels = result.map(item => item[dataKey].toUpperCase());

        if(dataKey == 'main_category'){            
            setFilteredDataMC(result);
        }
        else {            
            setFilteredDataP(result);
        }
        
        let chart = {
            labels: labels,
            datasets: [
                {
                    label: 'Casos',
                    backgroundColor: colors,
                    data: result.map(item => item.tickets.length),
                }                
            ]
        };  

        dataKey == 'main_category'? setDataChartMC(chart) : setDataChartP(chart);
    }

    const filterData = (dataKey, filter) => {
        let result, labels;

        let dataByKey = filter.tickets.reduce((acc, item) => {
            acc[item[dataKey]] = acc[item[dataKey]] || [];
            acc[item[dataKey]].push(item);
            return acc;
        }, {});

        result = Object.keys(dataByKey).map(key => {
            return {
                [dataKey]: key,
                tickets: dataByKey[key]
            }
        });
        
        labels = result.map(item => {
            return item[dataKey].toUpperCase();
        });

        let chart = {
            labels: labels,
            datasets: [
                {
                    label: 'Casos',
                    backgroundColor: colors,
                    clip: {left: 5, top: false, right: -2, bottom: 0},
                    data: result.map(item => item.tickets.length),
                }                
            ]
        };  

        let total_cases = result.reduce((acc, item) => acc + item.tickets.length, 0);
        
        if(dataKey == 'problem') {
            setFilteredDataP(result);
            setTotalCasesP(total_cases);
            setTotalCasesC(null);
            setDataChartP(chart);
            setDataChartC(null);
        }
        else {
            setFilteredDataC(result);
            setTotalCasesC(total_cases);
            setDataChartC(chart);
        }        
    }

    const renderStockChart = (dataKey, filter) => {
        let result, labels;

        let dataByKey = filter.reduce((acc, item) => {
            acc[item['stock']] = acc[item['stock']] || [];
            acc[item['stock']].push(item);
            return acc;
        }, {});

        result = Object.keys(dataByKey).map(key => {            
            return {
                [dataKey]: key,
                tickets: dataByKey[key]
            }
        });
        
        labels = result.map(item => item[dataKey].toUpperCase());

        let chart = {
            labels: labels,
            datasets: [
                {
                    label: 'Casos',
                    backgroundColor: colors,
                    clip: {left: 5, top: false, right: -2, bottom: 0},
                    data: result.map(item => item.tickets.length),
                }                
            ]
        };  

        setFilteredDataS(result);
        setDataChartStockType(chart);
    }

    const seedGeoMarkers = (selected, dataKey) => {
        let markersData = selected.map(log => {
            return {
                customer_code: log.customer_code,
                geocode: log.customer_geo,
                html: `<div style="background:#3b00b3;border-radius:13px;padding: 3px;">
                        <div style="background:#9966ff;padding: 6px;border-radius: 10px 10px 0px 0px; color: white;">
                            <h1>Información</h1>
                        </div>
                        <div style="background:#f2f2f2;padding: 6px;border-radius: 0px 0px 10px 10px;">
                            <p><strong>Cliente:</strong> ${log.customer_code}</p>                    
                        </div>
                    </div>`,
                markerOptions: {
                    scale: 0.5
                }
            }
        });

        if (dataKey == 'main_category') {
            setMarkersMC(markersData);
            setMarkersP(null);
            setMarkersC(null);
            setMarkersS(null);
        }
        else if (dataKey == 'problem') {
            setMarkersP(markersData);   
            setMarkersC(null);
            setMarkersS(null);
        }
        else if (dataKey == 'cause') {
            setMarkersC(markersData);
            setMarkersP(null);
        }     
        else {
            setMarkersS(markersData);
        }
    }

    // Chart formatters 
    const formatterMC = (value, context) => {
        return ((value * 100)/totalCasesMC).toFixed(2) + '%';
    }
    const formatterP = (value, context) => {
        return ((value * 100)/totalCasesP).toFixed(2) + '%';
    }
    const formatterC = (value, context) => {
        return ((value * 100)/totalCasesC).toFixed(2) + '%';
    }

    useEffect(() => {
        if(data) {
            setTotalCasesMC(data.length);
            setTotalCasesP(data.length);
            setAuxData(data);
            renderChart(data, 'main_category');
            renderChart(data, 'problem');
            setDataChartC(null);
            setDataChartStockType(null);
            setMarkersMC(null);
            setMarkersP(null);
            setMarkersC(null);
            setMarkersS(null);
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
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '75%', xl: '55%'}} alignSelf={'center'}>                    
                                <Flex direction={'row'} justifyContent={'space-between'} >    
                                    <Text mb={2} fontSize={20} fontWeight={'medium'}> Categorías Principales </Text>
                                    <Box >                    
                                        <Checkbox value='W' isChecked={wirelessTech} disabled={!foTech} onChange={(e => handleCheckbox(e))}>Wireless</Checkbox>
                                        <Checkbox value='FO' isChecked={foTech} mx={3} disabled={!wirelessTech} onChange={(e => handleCheckbox(e))}>FO</Checkbox>
                                    </Box>
                                </Flex>
                                <ChartRefContextMC.Provider value={chartRefMC}>                                    
                                    { dataChartMC && 
                                        <CustomPieChart data={dataChartMC} onClick={(e) => onChartClick(e, 'main_category')} context={ChartRefContextMC} formatter={formatterMC} />
                                    }
                                </ChartRefContextMC.Provider>
                            </Box>
                        }
                        { !data?.error && data?.length === 0 &&
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

                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '75%', xl: '55%'}} alignSelf={'center'} ref={chartRefPToScrollDown}>
                                <ChartRefContextP.Provider value={chartRefP}>
                                    <Flex direction={'row'} justifyContent={'space-between'} >    
                                        <Text mb={2} fontSize={20} fontWeight={'medium'}> Problemas </Text>
                                        <Tooltip label={'Recargar gráficos.'} placement={'top'}>                    
                                            <Button colorScheme={'teal'} onClick={() => resetChartData()}><MdAutorenew/></Button>
                                        </Tooltip>
                                    </Flex>
                                    { main_category &&
                                        <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos por {main_category} </Text>
                                    }
                                    { dataChartP && 
                                        <ChartComponent data={dataChartP} type={'pie'} intersect={true} onClick={(e) => onChartClick(e, 'problem')} context={ChartRefContextP} formatter={formatterP} scales={false} radius={'95%'}/>
                                    }
                                </ChartRefContextP.Provider>
                            </Box>
                        }
                    </Flex> 

                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '75%', xl: '55%'}} alignSelf={'center'} ref={chartRefCToScrollDown}>
                                <ChartRefContextC.Provider value={chartRefC}>
                                    <Text mb={2} fontSize={20} fontWeight={'medium'}> Causas </Text>
                                    { problem &&
                                        <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos por {problem} </Text>
                                    }  
                                    { dataChartC ? 
                                        <Box>
                                            <ChartComponent data={dataChartC} type={'pie'} intersect={true} onClick={(e) => onChartClick(e, 'cause')} context={ChartRefContextC} formatter={formatterC} scales={false} radius={'95%'}/>
                                        </Box>
                                        :
                                        <Text>Seleccione un problema para visualizar la información.</Text>
                                    }
                                </ChartRefContextC.Provider>
                            </Box>
                        }
                    </Flex> 

                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', lg: '75%', xl: '55%'}} alignSelf={'center'}>
                                <ChartRefContextS.Provider value={chartRefS}>
                                    <Text mb={2} fontSize={20} fontWeight={'medium'}> Tipo de Stock </Text>
                                    { main_category &&
                                        <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos por {main_category} </Text>
                                    }  
                                    { dataChartStockType ? 
                                        <Box>
                                            <ChartComponent data={dataChartStockType} type={'pie'} intersect={true} onClick={(e) => onChartClick(e, 'stock')} context={ChartRefContextS} formatter={formatterP} scales={false} radius={'95%'}/>
                                        </Box>
                                        :
                                        <Text>Seleccione una de las siguientes categorías principales para visualizar la información: Drop, ONU, Router </Text>
                                    }
                                </ChartRefContextS.Provider>
                            </Box>
                        }
                    </Flex> 

                    <Flex flexDir={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'}>
                        <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={'100%'} alignSelf={'center'}>
                            <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                                Mapa
                            </Text>
                            {   stock?
                                <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos de {stock} </Text>
                                :
                                cause ?
                                <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos de {cause} </Text>
                                :
                                problem ?
                                <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos de {problem} </Text>
                                :
                                main_category ?
                                <Text mb={2} fontSize={18} fontWeight={'medium'}> Casos de {main_category} </Text>
                                :
                                null
                            } 
                            <MapComponent dataMarkers={markersS? markersS : markersC? markersC : markersP? markersP : markersMC? markersMC : null} />
                        </Box>
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

const EvolutionChart = () => {
    const [dataChartMC, setDataChartMC] = useState(null);
    const [dataChartP, setDataChartP] = useState(null);
    const [dateInterval, setDateInterval] = useState({
        start: dayjs().date(1).subtract(5, 'month').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
    });
    const [technology, setTechnology] = useState('FO');
    const [main_category, setMainCategory] = useState(null);

    const { data, isLoading } = useSWR(`/api/dashboard/getServiceLogs?recurrent=${false}&fromDate=${dateInterval.start}&toDate=${dateInterval.end}`, fetcher);

    const chartRefMC = useRef();
    const chartRefToScrollDown = useRef();

    const sortValues = (a, b) => {
        let aValue = Number(a.formattedValue.replace(',', '.'));
        let bValue = Number(b.formattedValue.replace(',', '.'));

        return bValue - aValue;
    };

    const onChartClick = (event, type) => {
        const activePoints = getElementAtEvent(chartRefMC.current, event);
        
        if(activePoints && activePoints.length > 0) {
            let category = chartRefMC.current?.legend.legendItems[activePoints[0].datasetIndex]?.text;
            let dataAux = data.filter(ticket => ticket.main_category === category);
            setMainCategory(category);
            
            if(dataAux){
                let dataChart = createChart(dataAux, 'problem');
                setDataChartP(dataChart);
                setTimeout(() => {
                    chartRefToScrollDown?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }

    const createChart = (data, datakey) => {
        let dataAux;

        if (datakey == 'main_category') 
            dataAux = filterTechnology(data, technology);
        else 
            dataAux = data;

        dataAux = dataAux.reduce((acc, ticket) => {
            acc[ticket[datakey]] = acc[ticket[datakey]] || [];
            acc[ticket[datakey]].push(ticket);
            return acc;
        }, {});

        let result = Object.keys(dataAux).map(key => {
            return {
                [datakey]: key,
                tickets: dataAux[key].reduce((acc, item) => {
                    let month = dayjs(item.createdAt, 'DD/MM/YYYY HH:mm:ss').format('MM');
                    acc[month] = acc[month] || [];
                    acc[month].push(item);
                    
                    return acc;
                }, {})
            }
        });

        const months = new Map();

        let ticketsByMonth = result.map(item => {        
            return {
                [datakey]: item[datakey],
                tickets: Object.keys(item.tickets).map(key => {
                    // Total de tickets por mes
                    if(!months.has(key)) {
                        let tksQty = item.tickets[key].length;
                        months.set(key, tksQty);
                    }
                    else {
                        months.set(key, months.get(key) + item.tickets[key].length);
                    }

                    return {
                        month: key,
                        tickets: item.tickets[key]
                    }
                })
            }
        });       
        
        
        const labels = new Map();
        for (let i = parseInt(dayjs(dateInterval.start).format('MM')); i <= dayjs(dateInterval.end).format('MM'); i++) {
            labels.set(i, dayjs().month(i - 1).format('MMMM').toUpperCase());
        }

        const dataChart = {
            labels: Array.from(labels.values()),
            datasets: ticketsByMonth.map((category, i) => {
                let tickets = Array.from(labels.keys()).map(month => {
                    let m = month.toString().padStart(2, '0');
                    let tks = category.tickets.find(ticket => ticket.month == m)?.tickets.length || 0;                        
                    tks = (tks * 100) / months.get(m);

                    return tks.toFixed(2);
                });

                return {
                    type: 'line',
                    label: category[datakey],
                    borderColor: colors[i],
                    backgroundColor: colors[i],
                    borderWidth: 3,
                    fill: false,
                    data: tickets,
                    datalabels: {
                        align: 'end',
                        anchor: 'end'
                    },         
                }
            })
        }

        return dataChart;
    }

    const filterTechnology = (data, tech) => {
        let dataFiltered = data.filter(ticket => ticket.technology == tech);
        return dataFiltered;
    }

    const formatter = (value, context) => {
        return `${Number(value).toFixed(1)}%`;
    }

    useEffect(() => {
        if(data) {
            let chart = createChart(data, 'main_category');

            setDataChartMC(chart);
            setDataChartP(null);
        }
    }, [data, technology]);


    return(
        <Box m={0} p={0} w={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={10}>
            <Box bg={'white'} rounded={'lg'} w={'80%'} p={7}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={5}>
                    <Text fontSize={'xl'} fontWeight={'semibold'} >
                        Categorías Principales
                    </Text>
                    <RadioGroup onChange={setTechnology} value={technology} display={'flex'} gap={5} mb={5}>
                        <Radio value='FO'>Fibra Óptica</Radio>
                        <Radio value='W'>Wireless</Radio>
                    </RadioGroup>
                </Box>
                <ChartRefContextMC.Provider value={chartRefMC}>
                { dataChartMC &&
                    <ChartComponent data={dataChartMC} type={"line"} formatter={formatter} onClick={(e) => onChartClick(e, 'main_category')} context={ChartRefContextMC} stacked={false} scales={true} sort={sortValues} />
                }
                </ChartRefContextMC.Provider>
            </Box>
            
            <Box w={'80%'} ref={chartRefToScrollDown}>
                { dataChartP && main_category &&
                    <Box bg={'white'} rounded={'lg'} w={'100%'} p={7}>                        
                        <Text fontSize={'xl'} fontWeight={'semibold'} mb={5}>
                            Casos por {main_category}
                        </Text>
                        <ChartComponent data={dataChartP} type={"line"} formatter={formatter} stacked={false} scales={true} sort={sortValues} />
                    </Box>
                }
            </Box>            
        </Box>
    )
}


export default ChartProblemasFrecuentes;