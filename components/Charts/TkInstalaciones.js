import { Flex, Text, Center, Spinner, Box, Select, Button, Tooltip, Icon, Divider } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/react";
import { useState, useEffect, useRef, createContext } from 'react';
import useSWR from 'swr'
import fetcher from "@/utils/Fetcher";
import dayjs from 'dayjs';
import ChartComponent from "@/components/Charts/Chart.js";
import BoatError from "@/components/Errors/Boat";
import 'dayjs/locale/es';
import Table from '@/components/Datatable/Table.js';
import { colors } from '../../constants/colors.js';
import { getElementAtEvent } from 'react-chartjs-2';
import { MdAutorenew, MdQuestionMark, MdCloudDownload } from 'react-icons/md';
import { downloadExcel } from 'react-export-table-to-excel';


dayjs.locale('es');

const ChartInstalaciones = () => {
    const [guarantees, setGuarantees] = useState([]);
    const [techGuarentees, setTechGuarentees] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, isLoading } = useSWR('/api/dashboard/getInstallationTicketsData', fetcher);

    const handleOnClose = () => {
        onClose();
        setTechGuarentees(null);
    }

    const handleDownloadExcel = () => {
        //console.log(data);
        let dataTable = data.flatMap(tech => {
            return tech.tickets.flatMap(tickets => {
                return tickets.tickets.map(ticket => {
                    return {
                        tecnico: ticket.tecnico,
                        tk_instalacion: ticket.id,
                        codigo_cliente: ticket.codigo_cliente,
                        categoría: ticket.nombre,
                        fecha_alta: dayjs(ticket.fecha_alta).format('DD/MM/YYYY'),
                        tickets: ticket.tk_st.length > 0 ? ticket.tk_st.map(st => `Ticket #${st.id} - ${st.nombre} - ${dayjs(st.fecha_alta).format('DD/MM/YYYY')}`).join(', ') : ''
                    }
                })
            })
        });

        //console.log(dataTable);

        downloadExcel({
            fileName: `Instalaciones_y_garantías_${dayjs().format('DD-MM-YYYY')}`,
            sheet: 'Instalaciones',
            tablePayload: {
                header: ['Técnico', 'Tk Instalación', 'Codigo Cliente', 'Categoría', 'Fecha Alta', 'Tickets Garantías y ST (hasta 45 días luego de intalación)'],
                body: dataTable
            }
        });
    }

    let columns = [
        {
            name: 'Tecnico',
            selector: row => row.tecnico,
            sortable: true,
        },
        {
            name: 'Instalaciones',
            selector: row => row.tickets_total,
            sortable: true,
        },
        {
            name: 'Garantias',
            selector: row => row.garantias_total,
            sortable: false
        },
        {
            name: 'Ver garantías',
            cell: row => <Button colorScheme='teal' variant='outline' size='sm' isDisabled={row.garantias_total === 0} onClick={() => { setTechGuarentees(row.tickets); onOpen() }}>Ver</Button>
        }
    ]

    useEffect(() => {
        if(data){
            let dataGuarantees = data.map(tech => {
                return {
                    ...tech,
                    tickets: tech.tickets.flatMap(tickets => {
                        return tickets.tickets.filter(ticket => {
                            return ticket.tk_st.length > 0;
                        })
                    }),
                }
            });

            setGuarantees(dataGuarantees);            
        }
    }, [data]);
    
    return(
        <>
            { data?                                 
                <Box m={0} p={0}>
                    <Text fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'} mb={5}>
                        Instalaciones y garantías
                    </Text>
                    <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={2}>
                        Categorías: Instalaciones, Instalaciones Fibra, Instalaciones fibra Decimo, Instalaciones Extensible                        
                    </Text>
                    <Text fontSize={'md'} fontWeight={'medium'} textAlign={'center'} mb={5}>
                        Rango de tiempo: 6 meses
                    </Text>
                    { data?.error &&
                        <BoatError title={'Ocurrió un error al intentar mostrar dashboard de instalaciones.'} />
                    }

                    <Flex direction={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', md: '90%'}}>
                                <Text mb={2}> Instalaciones General </Text>
                                <TicketsChart data={data} />
                            </Box>
                        }
                    </Flex>

                    <Flex direction={{base: 'column', lg: 'row'}} wrap={'wrap'} gap={4} justifyContent={'center'} >
                        { !data?.error && data?.length > 0 &&
                            <Box boxShadow='lg' mb={7} p={5} backgroundColor={'white'} borderRadius={'lg'} w={{base: '100%', md: '90%'}}>
                                <TicketsByTechChart data={data} />
                            </Box>
                        }
                    </Flex>
                    
                        { guarantees.length > 0 &&
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} mt={5} rounded={'md'}>
                                <Table 
                                    columns={columns} 
                                    data={guarantees} 
                                    isLoading={isLoading} 
                                    title={'Instalaciones y garantías'} 
                                    containerWidth={{base: '100%', md: '70%'}}  
                                    customButtonHeader={<Button width='220px' mr={5} size='sm' colorScheme='teal' leftIcon={<MdCloudDownload/>} onClick={handleDownloadExcel}> Descargar Reporte </Button>}                                   
                                />                                
                            </Box>
                        }
                    
                    { techGuarentees &&
                        <GuaranteesModal tickets={techGuarentees} isOpen={isOpen} onClose={handleOnClose} />
                    }
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

const TicketsChart = ({ data }) => {
    let labels = data.flatMap(item => item.tickets.map(ticket => ticket.month));
    labels = [...new Set(labels)];

    let dataset = labels.map(month => {
        return {
            month: month,
            tickets_total: 0,
            garantias_total: 0,
            porcentaje_garantias: 0
        }
    });

    dataset.forEach(item => {
        data.forEach(tech => {
            const month = tech.tickets.find(ticket => ticket.month === item.month);
            if(month){
                item.tickets_total += month.tickets_total;
                item.garantias_total += month.garantias;
            }
        });
        item.porcentaje_garantias = ((item.garantias_total / item.tickets_total) * 100).toFixed(2);
    });


    const dataChart = {
        labels: labels.map(item => dayjs(item).locale('es').format('MMMM').toUpperCase()),
        datasets: [
            {
                type: 'line',
                label: '% Garantías',
                borderColor: 'rgb(0, 153, 153)',
                backgroundColor: 'rgb(0, 153, 153)',
                borderWidth: 2,
                fill: false,
                data: dataset.map(item => ((item.garantias_total / item.tickets_total) * 100).toFixed(2)),
                datalabels: {
                    align: 'end',
                    anchor: 'end'
                }
            },
            {
                type: 'bar',
                label: 'Instalaciones',
                backgroundColor: 'rgb(153, 187, 255)',
                data: dataset.map(item => Number(item.tickets_total)),
                datalabels: {
                    align: 'end',
                    anchor: 'center'
                }
            }
        ]
    };

    const maxValue = Math.max(...data.map(item => Number(item.tickets_total)));    

    return(
        <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={true} scales={true} />
    )
}

const ChartRefContext = createContext();

const TicketsByTechChart = ({ data }) => {
    const [auxData, setAuxData] = useState(data);
    const [filteredData, setFilteredData] = useState(data);
    const [dataChart, setDataChart] = useState(null);
    const [maxValue, setMaxValue] = useState(0);
    const [tech, setTech] = useState(null);
    const [labels, setLabels] = useState(false);
    const [month, setMonth] = useState('');

    const chartRef = useRef();
    const onChartClick = (event) => {
        if(tech){
            return;
        }

        const activePoints = getElementAtEvent(chartRef.current, event);

        if (activePoints.length > 0) {
            const clickedElementIndex = activePoints[0].datasetIndex;            
            let data = auxData[clickedElementIndex];

            setFilteredData([data]);
            setTech(data.tecnico);            
        }
        setMonth('');
    }

    const handleSelect = (e) => {
        let newData = auxData.map(tech => {
            return {
                ...tech,
                tickets: tech.tickets.filter(ticket => ticket.month === e.target.value)
            }
        });
        setMonth(e.target.value);
        setFilteredData(newData);
        setTech(null);
    }

    const resetChartData = () => {
        setFilteredData(auxData);
        setTech(null);
        setMonth('');
    }

    useEffect(() => {
        let chartLabels;

        if(!labels){
            chartLabels = filteredData.flatMap(item => item.tickets.map(ticket => ticket.month));
            chartLabels = [...new Set(chartLabels)];
            setLabels(chartLabels);

            chartLabels = chartLabels.map(item => dayjs(item).locale('es').format('MMMM').toUpperCase());
        }
        else {
            chartLabels = month && month != ''? [dayjs(month).locale('es').format('MMMM').toUpperCase()] : labels.map(item => dayjs(item).locale('es').format('MMMM').toUpperCase());
        }

        let chart = null;

        if(filteredData.length == 1){
            chart = {
                labels: chartLabels,
                datasets: [
                    {
                        type: 'line',
                        label: '% Garantías',
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        data: filteredData[0].tickets.map(month => ((month.garantias / month.tickets_total) * 100).toFixed(2)),
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    },
                    {
                        type: 'bar',
                        label: 'Instalaciones',
                        data: filteredData[0].tickets.map(month => month.tickets_total),
                        backgroundColor: 'rgb(153, 204, 255)',
                    },
                    {
                        type: 'bar',
                        label: 'Garantías',
                        data: filteredData[0].tickets.map(month => month.garantias),
                        backgroundColor: 'rgb(0, 153, 153)',
                    }                    
                ]
            };            
        }
        else {
            chart = {
                labels: chartLabels,
                datasets: filteredData.map((item,i) => {
                    let color = i > colors.length-1? colors[i-colors.length] : colors[i];
                    return {
                        type: 'bar',
                        label: item.tecnico,
                        data: chartLabels.map(month => item.tickets.find(ticket => dayjs(ticket.month).locale('es').format('MMMM').toUpperCase() === month)?.tickets_total || null),
                        backgroundColor: color,
                        skipNull: true,
                        borderSkipped: 'left'
                    }
                })
            };
        }

        setDataChart(chart);

        let ticketsTotal = filteredData.flatMap(item => item.tickets.map(ticket => ticket.tickets_total));
        let guaranteesTotal = chart.datasets.length > 1? filteredData.flatMap(item => item.tickets.map(ticket => ticket.garantias / ticket.tickets_total * 100)) : null;
        const max = Math.max(...ticketsTotal) > Math.max(...guaranteesTotal)? Math.max(...ticketsTotal) : Math.max(...guaranteesTotal);    
        setMaxValue(max + 5);

    }, [filteredData]);
    

    return(
        <ChartRefContext.Provider value={chartRef}>
            <Flex direction={{base: 'column', md: 'row'}} justifyContent={'space-between'}>
                <Flex alignItems={'center'} mb={2} w={{base: '100%', md: '50%'}}>
                    <Text> {tech? tech : 'Instalaciones por técnico o grupo externo'} </Text>
                    <Tooltip label={'Haga click en uno de los grupos para filtrarlo y ver más información.'} placement={'top'}>
                        <span><Icon as={MdQuestionMark} ml={3}/></span>
                    </Tooltip>
                </Flex>
                <Flex alignItems={'center'} mb={2} justifyContent={'space-between'} w={{base: '100%', md: '50%'}}>
                    { labels &&
                        <Select
                            placeholder="Seleccione un mes"
                            size={'sm'}
                            w={{base: '60%', lg: '40%'}}
                            value={month}
                            onChange={(e) => handleSelect(e)}>
                                {   labels.map((item, i) => {
                                        return <option key={i} value={item}>{dayjs(item).locale('es').format('MMMM').toUpperCase()}</option>
                                    })
                                }
                            </Select>
                    }
                    <Tooltip label={'Cargar todos los grupos.'} placement={'top'}>                    
                        <Button colorScheme={'teal'} onClick={() => resetChartData()}><MdAutorenew/></Button>
                    </Tooltip>
                </Flex>
            </Flex>
            { dataChart && 
                <ChartComponent data={dataChart} suggestedMax={maxValue} stacked={false} interactionMode={month != ''? 'x' : 'index'} onClick={onChartClick} context={ChartRefContext} scales={true}/>
            }
        </ChartRefContext.Provider>
    )
}


const GuaranteesModal = ({tickets, isOpen, onClose}) => { 

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'3xl'} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader> {tickets[0].tecnico} </ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY={'scroll'} maxH={'75vh'}>
                    <Flex direction={'row'} alignItems={'center'} justifyContent={'center'} wrap={'nowrap'} mb={5} rounded={'xl'} border={'2px solid #009999'}>
                        <Box w={'30%'} textAlign={'center'} mr={3} borderRight={'2px solid #009999'} bg={'#009999'} color={'white'} fontWeight={'semibold'}>
                            <Text my={2}> Ticket Instalación </Text>                                                           
                        </Box> 
                        <Box w={'70%'} textAlign={'center'} mr={3} >
                            <Text my={2}> Tickets ST </Text>                                                           
                        </Box> 
                    </Flex>
                    { tickets.length > 0 &&
                        tickets.map((ticket, i) => {
                            return (
                                <Flex key={i} direction={'row'} alignItems={'stretch'} bg={'#009999'} justifyContent={'center'} wrap={'nowrap'} mb={5} rounded={'xl'} border={'2px solid #009999'} fontSize={'sm'}>
                                    <Box w={'30%'} textAlign={'center'} color={'white'} fontWeight={'semibold'} my={'auto'}>
                                        <Text my={2}> Ticket #{ticket.id} </Text>
                                        <Text my={2}> {ticket.nombre} </Text>
                                        <Text my={2}> {dayjs(ticket.fecha_alta).format('DD/MM/YYYY')} </Text>
                                        <Text my={2}> Cliente {ticket.codigo_cliente} </Text>                                        
                                    </Box>                    
                                    <Flex w={'70%'} textAlign={'center'} borderLeft={'2px solid #009999'} bg={'white'} direction={'column'} justifyContent={'center'} roundedRight={'10px'} >
                                        { 
                                            ticket.tk_st
                                            .sort((a, b) => new Date(a.fecha_alta) - new Date(b.fecha_alta))
                                            .map((st, i) => {
                                                return (
                                                    <Flex key={i} p={2} my={2} direction={'row'} justifyContent={'space-between'} textAlign={'center'} w={'100%'} >
                                                        <Text mx={2}> Ticket #{st.id} </Text>
                                                        <Text mx={2}> {st.nombre} </Text>
                                                        <Text mx={2}> {dayjs(st.fecha_alta).format('DD/MM/YYYY')} </Text>
                                                    </Flex>
                                                )
                                            }).sort((a, b) => new Date(a.fecha_alta) - new Date(b.fecha_alta))
                                        }
                                    </Flex>                                   
                                </Flex>
                            )
                        })
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="facebook" variant='solid' mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}


export default ChartInstalaciones;