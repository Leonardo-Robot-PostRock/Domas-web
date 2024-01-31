import fetcher from "@/utils/Fetcher";
import { Avatar, Badge, Box, Button, Container, Divider, Flex, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import useSWR, { mutate } from "swr";
import { datetimeFromNow, datetimeFormatted } from "@/utils/Datetime.js";
import { Tooltip } from "@chakra-ui/react";
import RenderHighlightedText from "@/components/RenderHighlightedText";
import { initials } from '@dicebear/collection';
import { createAvatar } from "@dicebear/core";
import { useEffect, useRef, useState } from "react";
import { ViewportList } from "react-viewport-list";
import ConeError from "@/components/Errors/Cone";
import { downloadExcel } from 'react-export-table-to-excel';
import { MdCloudDownload } from 'react-icons/md';

function ActivityData () {
    const ref = useRef(null);
    const [items, setItems] = useState([]);

    // implementacion de useSWR para hacer fetch de 
    // y mostrar los datos en la vista
    let { data, error, mutate } = useSWR(`/api/history/getAllChangeGeo`, fetcher);

    useEffect(() => {
        if (data?.data) {
            setItems([...items, ...data.data]);
        }
    }, [data])

    //TODO mejorar el manejo de errores
    if (error || data?.error) return <ConeError />

    if (!data || !data.data) return (

        <Stack>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
        </Stack>
    );
    data = data.data;


    return (
        <Container maxH={'70ch'} maxW={'100%'} overflowY={'auto'} className="scroll-container" ref={ref}>
            <div className="scroll-container" ref={ref}>
                {
                    data && <ViewportList
                        viewportRef={ref}
                        items={data}
                    >
                        {(item) => (
                            <Flex key={item.id} mt={5} flexDir={'row'} gap={8} alignItems={'center'}>
                                <Tooltip label={item.user.name}>
                                    <Avatar src={item.user.photo ? `data:image/jpeg;base64,${item.user.photo}` : createAvatar(initials, {
                                        size: 64,
                                        seed: item.user.name
                                    }).toDataUriSync()} size={'md'} ml={'1.2vh'} mb={'1vh'} />
                                </Tooltip>
                                <Flex flexDir={'column'} gap={1} w={'100%'}>
                                    {RenderHighlightedText(item.description, { fontWeight: 'normal', fontSize: '1.6vh', color: '#435360' })}

                                    <Flex color={'#93A5B4'} fontSize={'1.2vh'} gap={1}>
                                        <Tooltip label={datetimeFormatted(item.createdAt, 'DD/MM/YYYY HH:mm')} >
                                            <Text>
                                                {datetimeFromNow(item.createdAt)}
                                            </Text>
                                        </Tooltip>
                                        <Text>
                                            por {item.user.name}
                                        </Text>
                                    </Flex>
                                    <Divider mt={3} />
                                </Flex>
                            </Flex>
                        )}
                    </ViewportList>
                }

            </div>
        </Container>

        // <Container maxH={'70ch'} maxW={'100%'} overflowY={'auto'} className="scroll-container" ref={ref}>
        //     <Box mt={5}>

        //         <ViewportList viewportRef={ref} items={data} itemMinSize={40} margin={8}>
        //             {
        //                 {item, index) => (
        //                     <Flex key={index} mt={5} flexDir={'row'} gap={8} alignItems={'center'}>
        //                         <Tooltip label={item.user.name}>
        //                             <Avatar src={item.user.photo ? `data:image/jpeg;base64,${item.user.photo}` : createAvatar(initials, {
        //                                 size: 64,
        //                                 seed: item.user.name
        //                             }).toDataUriSync()} size={'md'} ml={'1.2vh'} mb={'1vh'} />
        //                         </Tooltip>
        //                         <Flex flexDir={'column'} gap={1} w={'100%'}>
        //                             {RenderHighlightedText(item.description, { fontWeight: 'normal', fontSize: '1.6vh', color: '#435360' })}

        //                             <Flex color={'#93A5B4'} fontSize={'1.2vh'} gap={1}>
        //                                 <Tooltip label={datetimeFormatted(item.createdAt, 'DD/MM/YYYY HH:mm')} >
        //                                     <Text>
        //                                         {datetimeFromNow(item.createdAt)}
        //                                     </Text>
        //                                 </Tooltip>
        //                                 <Text>
        //                                     por {item.user.name}
        //                                 </Text>
        //                             </Flex>
        //                             <Divider mt={3} />
        //                         </Flex>
        //                     </Flex>
        //                 ))
        //             }
        //         </ViewportList>


        //     </Box>


        // </Container>
    )
}

function StLogData () {
    const ref = useRef(null);
    const [items, setItems] = useState([]);

    // implementacion de useSWR para hacer fetch de 
    // y mostrar los datos en la vista
    let { data, error, mutate } = useSWR(`/api/history/getAllStLogs`, fetcher);

    useEffect(() => {
        if (data?.logs) {
            setItems([data.logs]);
        }
    }, [data])

    //TODO mejorar el manejo de errores
    if (error || data?.error) return <ConeError />

    if (!data || !data.logs) return (

        <Stack>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
        </Stack>
    );
    data = data.logs;
    //console.log(data);

    const handleDownloadExcel = () => {
        let log = data.map((item) => {
            return {
                fecha: item.date,
                cluster: item.cluster,
                team: item.team,
                ticket_id: item.ticket_id,
                customer: item.customer_code,
                main_problem: item.main_category,
                stock_type: item.stock_type,
                stock: item.stock,
                problem: item.problem,
                cause: item.cause,                
                improvements: item.improvements
            }
        });

        downloadExcel({
            fileName: `Reporte Tareas Realizadas_${datetimeFormatted(new Date(), 'DD-MM-YYYY')}`,
            sheet: 'Reporte Tareas Realizadas',
            tablePayload: {
                header: ['Fecha', 'Cluster', 'Cuadrilla', 'Ticket', 'Cliente', 'Causa Principal', 'Tipo de Stock', 'Stock', 'Problema', 'Causa', 'Mejoras'],
                body: log
            }
        });
    }


    return (
        <Box>            
            <Container maxH={'60ch'} maxW={'100%'} overflowY={'auto'} className="scroll-container" ref={ref}>            
                <div className="scroll-container" ref={ref}>
                    {
                        data && <ViewportList
                            viewportRef={ref}
                            items={data}
                        >
                            {(item) => (
                                <Flex key={item.ticket_id} mt={2} flexDir={'row'} gap={8} alignItems={'center'}>
                                    <Tooltip label={item.team}>
                                        <Avatar src={createAvatar(initials, {
                                            size: 64,
                                            seed: item.team.match(/^[ST]/)? item.team.slice(3) : item.team.match(/^[E]/)? item.team.slice(2) : item.team
                                        }).toDataUriSync()} size={'md'} ml={'1.2vh'} mb={'1vh'} />
                                    </Tooltip>
                                    <Flex flexDir={'column'} gap={1} w={'100%'}>
                                        <Flex key={item.ticket_id} mt={5} flexDir={'row'} gap={10} alignItems={'center'}>
                                            <Badge colorScheme={'purple'}>Ticket: {item.ticket_id}</Badge>
                                            <Badge colorScheme={'blue'}>Cliente: {item.customer_code}</Badge>
                                            <Badge colorScheme={'green'}>Cluster: {item.cluster}</Badge>
                                        </Flex>
                                        
                                        <Text><strong>Causa principal del ST:</strong> {item.main_category}</Text>
                                        {item.stock_type == 'drop' && <Text><strong>Tipo de Drop:</strong> {item.stock}</Text>}
                                        {item.stock_type == 'onu' && <Text><strong>Tipo de ONU:</strong> {item.stock}</Text>}
                                        {item.stock_type == 'router' && <Text><strong>Tipo de Router:</strong> {item.stock}</Text>}
                                        <Text><strong>Problema:</strong> {item.problem}</Text>
                                        <Text><strong>Causa:</strong> {item.cause}</Text>
                                        <Text><strong>Mejoras:</strong> {item.improvements || '-'}</Text>

                                        <Flex color={'#93A5B4'} fontSize={'1.2vh'} gap={1}>
                                            <Tooltip label={item.date} >
                                                <Text>
                                                    {item.date}
                                                </Text>
                                            </Tooltip>
                                            <Text>
                                                por {item.team}
                                            </Text>
                                        </Flex>
                                        <Divider mt={3} />
                                    </Flex>
                                </Flex>
                            )}
                        </ViewportList>
                    }   
                </div>
            </Container>
            {
                data && 
                <Flex flexDir={'row'} justifyContent={'center'}>
                    <Button width='250px' mt={1} size='sm' colorScheme='teal' leftIcon={<MdCloudDownload/>} onClick={handleDownloadExcel}> Descargar Reporte </Button>
                </Flex>
            }
        </Box>
    )
}

export default function Activity () {

    return (
        <Container
            mt={5}
            p={3}
            rounded={"lg"}
            shadow={"sm"}
            bg={"white"}
            minW="140vh"
            maxH={"85vh"}
        >
            <Tabs isFitted variant="enclosed">
                <TabList>
                    <Tab _selected={{ color:"#008080", borderColor:"#009999", borderBottomColor: "white" }} fontSize={'xl'}>Reporte Geos</Tab>
                    <Tab _selected={{ color:"#008080", borderColor:"#009999", borderBottomColor: "white" }} fontSize={'xl'}>Reporte Tareas Realizadas</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Flex flexDir={"column"} mb={5}>
                            <Text fontWeight={"bold"} fontSize={"4xl"} color={"#319DA0"}>
                                ACTIVIDAD
                            </Text>
                            <Text color={"#93A5B4"} fontSize={"1.5vh"}>
                                El listado de actividades como items individuales,
                                comenzando por la más reciente.
                            </Text>
                        </Flex>
                        <Divider />

                        <ActivityData />
                    </TabPanel>
                    
                    <TabPanel>
                        <Flex flexDir={"column"} mb={5}>
                            <Text fontWeight={"bold"} fontSize={"4xl"} color={"#319DA0"}>
                                ACTIVIDAD
                            </Text>
                            <Text color={"#93A5B4"} fontSize={"1.5vh"}>
                                El listado de actividades como items individuales,
                                comenzando por la más reciente.
                            </Text>
                        </Flex>
                        <Divider />

                        <StLogData />
                    </TabPanel>
                </TabPanels>
            </Tabs>
           
        </Container>
    );
}
