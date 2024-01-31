import CoordinateCard from "@/components/coordinateCard";

import { Flex, ListItem, UnorderedList, useColorModeValue, Container, Text, Badge, Tooltip, Box, Button, Link, Spacer } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/Fetcher";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Mendoza');

const Index = () => {
    const [tickets, setTickets] = useState();
    const [teams, setTeams] = useState();
    const [error, setError] = useState();
    
    const { data: team_events } = useSWR(`/api/team/coordinatedTks`, fetcher);

    const getMyTickets = async () => {
        const { data } = await axios.get(`${process.env.APP_URL}/api/coordinator/ticketsForCoordinate`)
            .then(response => {
                //console.log(response);
                return response;
            })
            .catch(err => {
                return err.response;
            });
        
        const { data: data_team } = await axios.get(`${process.env.APP_URL}/api/supervisor/getMyTeams`)
            .then(response => {
                //console.log(response);
                return response;
            })
            .catch(err => {
                return err.response;
            });
        
        if (data.tickets && data_team){
            data.tickets = data.tickets.map(t => { return {...t, order_id: data.id} });
            let dataTickets = {tickets: {}};

            dataTickets.tickets.programmed = data.tickets.filter(event => event.ticket_status == 'PROGRAMADA');
            dataTickets.tickets.recoordinate = data.tickets.filter(event => event.ticket_status == 'RECOORDINAR');
            dataTickets.tickets.pending = data.tickets.filter(event => event.ticket_status == 'PENDIENTE');

            dataTickets.teams = data_team;

            return dataTickets;
        }
        else {
            return data;
        }
    }

    useEffect(() => {
        const fetchTickets = getMyTickets();
        
        fetchTickets
        .then(res => {
            //console.log(res);
            if (res.tickets) {
                setTickets(res.tickets);
                setTeams(res.teams);
            }
            else {
                setError(res.message);
            }
        })
        .catch(err => console.log(err));
    
    }, []);


    return (
        <Box>            
            <Container mt={5} mb={5} maxW={'3xl'}
                backgroundColor={useColorModeValue('white', '#191d32')} borderRadius={20} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}>
                <Text fontSize={22} mt={5} textAlign={'center'}> Tickets coordinados para HOY </Text>
                <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'center'}>
                    { team_events &&
                        team_events.teams.map((item, i) => <TeamCoordinatedEvents key={i} data={item}/>)                    
                    }
                </Box>                
            </Container>

            <Container maxW={'3xl'} spacing={{ base: 8, md: 14 }} centerContent
                py={{ base: 20, md: 25 }} mt={5} mb={5} backgroundColor={useColorModeValue('white', '#191d32')} borderRadius={20} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}>
                <Toaster />
                <Text mb={'30px'} fontSize='4xl' fontWeight={'bold'} textAlign={'center'}> Coordinar Visitas </Text>
                {
                    tickets ? 
                    <UnorderedList listStyleType={"none"} ml={0} w='95%'>
                        
                        <Badge colorScheme='red' fontWeight='semibold' mt={1} mb={3}><Text as='u' fontSize={'15px'}> PROGRAMADOS </Text>
                            <Tooltip hasArrow label='Tickets con recordatorio para llamar hoy'>
                                    <span><AiIcon.AiOutlineQuestionCircle style={{ display: 'inline', marginLeft: '5px' }} size={15}/></span>
                            </Tooltip>
                        </Badge>                                                
                        <ListItem>
                            {   tickets.programmed.length > 0 ?
                                tickets.programmed.map((item, i) => <TicketCard key={item.id} data={item} order={i} teams={teams} />)
                                :
                                <Text fontWeight={'medium'} textAlign={'center'}> No hay tickets programados para hoy... </Text>
                            }

                        </ListItem>
                                            
                        <Badge colorScheme='blue' fontWeight='semibold' mt={5} mb={3}><Text as='u' fontSize={'15px'}> RECOORDINAR </Text>
                            <Tooltip hasArrow label='Tickets para recoordinar o que quedaron pendientes del día anterior'>
                                    <span><AiIcon.AiOutlineQuestionCircle style={{ display: 'inline', marginLeft: '5px' }} size={15} /></span>
                            </Tooltip>
                        </Badge>                        
                        <ListItem>
                            {   tickets?.recoordinate.length > 0 ?
                                tickets.recoordinate.map((item, i) => <TicketCard key={item.id} data={item} order={i} teams={teams} />)
                                :
                                <Text fontWeight={'medium'} textAlign={'center'}> No hay tickets para recoordinar... </Text>
                            }

                        </ListItem>
                       
                        <Badge colorScheme='green' fontWeight='semibold' mt={5} mb={3}><Text as='u' fontSize={'15px'}> PENDIENTES </Text>
                            <Tooltip hasArrow label='Tickets nuevos a coordinar'>
                                    <span><AiIcon.AiOutlineQuestionCircle style={{ display: 'inline', marginLeft: '5px' }} size={15} /></span>
                            </Tooltip>
                        </Badge>
                        <ListItem>
                            {   tickets?.pending.length > 0 ?
                                tickets.pending.map((item, i) => <TicketCard key={item.id} data={item} order={i} teams={teams} />)
                                :
                                <Text fontWeight={'medium'} textAlign={'center'}> No hay tickets pendientes a coordinar... </Text>
                            }

                        </ListItem>
                           
                    </UnorderedList> 
                    : 
                    error ? 
                        <p style={{textAlign: 'center'}}> {error} </p>
                        :
                        <p> Cargando eventos... </p>
                }

            </Container>
        </Box>
    )
}


const TicketCard = ({data, order, teams}) => {
    const { customer, id: ticketID, Team, ticket_category, appointment_date } = data;
    const color = useColorModeValue('#273D54', '#AAAFC5');

    const [open, setOpen] = useState(false);
    const [turns, setTurns] = useState(null);
    const [colorTask, setColorTask] = useState('#e6e6e6');

    const turnsAvailable = async (team_id) => {
        await axios.get(`/api/team/turnsAvailable?team_id=${team_id}`)
        .then(res => {
            setTurns(res.data);
        })
        .catch(err => {
            toast.custom(
                t => (
                    <Box backgroundColor={'white'} borderRadius={10} border={`4px solid #ff3300`} p={3} maxW={'xl'}> 
                        <Text> {err.response?.data || 'Error al cargar los turnos disponibles'} para la cuadrilla {Team.name}. </Text>
                        <Text fontSize={14} mt={3}> Tip: consulte los días libres de la cuadrilla. </Text>
                        <Button mx={'44%'} mt={3} colorScheme={'red'} onClick={() => toast.dismiss(t.id)}>OK!</Button>
                    </Box>
                ),
                {
                    position: 'bottom-center',
                    duration: Infinity
                }
            );
            setTurns({error: true});
            return err;
        });

    };

    useEffect(() => {
        if (open){
            turnsAvailable(Team.id)
        }
    }, [open]);

    return(
        <Box bg={useColorModeValue('#E3EAF2', '#2D354D')} borderRadius={20} py={3} px={4} mt={3} flexDirection={'column'}>
            <Accordion allowToggle>
                <AccordionItem>
                    <Flex flexDirection={'row'} justifyContent={'space-between'}>
                        <Flex flexDirection={'column'} w='100%'>
                            <Flex flexDirection={'row'} gap={4} >

                                <Tooltip label={`Ticket de mesa #${ticketID}`}>
                                    <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <AiIcon.AiOutlineLink style={{ display: 'inline' }} />
                                        <Text m={0} color={'blue.200'} fontSize={'12px'} fontWeight={'medium'}>
                                            <Link color={useColorModeValue('#0F66D5', '#66ff66')} href={`http://mesa.westnet.com.ar/ticket/ver/${ticketID}`} isExternal>
                                                #{ticketID}
                                            </Link>
                                        </Text>
                                    </Box>
                                </Tooltip>

                                <Tooltip label={`Categoría`}>
                                    <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <MdIcon.MdWorkspacesOutline style={{ display: 'inline' }} />
                                        <Text m={0} color={color} fontSize={'12px'} fontWeight={'medium'}>
                                            {ticket_category}
                                        </Text>
                                    </Box>
                                </Tooltip> 

                                <Spacer />

                                <Tooltip label={`ST Asignado`}>
                                    <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <MdIcon.MdPeople style={{ display: 'inline' }} />
                                        <Text m={0} color={color} fontSize={'12px'} fontWeight={'medium'}>
                                            {Team.name}
                                        </Text>                                        
                                    </Box>
                                </Tooltip> 

                                <Badge colorScheme={customer.geocode.latitude? 'green' : 'red'} mt={2}>
                                    {/* <Link color={color} href={`https://www.google.com/maps/search/?api=1&query=${customer.geocode.latitude},${customer.geocode.longitude}`} isExternal> */}
                                    <Link color={color} fontWeight={'medium'} href={ customer.customer_id? `http://mesa.westnet.com.ar/mapa/clientes/${customer.code}:${customer.customer_id}` : `https://www.google.com/maps/search/?api=1&query=${customer.geocode.latitude},${customer.geocode.longitude}`} isExternal>
                                        <MdIcon.MdLocationPin style={{ display: 'inline', alignSelf: 'center' }} />                                    
                                        GEO  
                                    </Link>                                   
                                </Badge>
                            </Flex>

                            <Text fontWeight={'semibold'} fontSize={'16px'} color={color} mt={2}>
                                {customer.code} - {customer.lastname.toUpperCase()} {customer.name.toUpperCase()}
                            </Text>

                            { appointment_date &&
                                <Text fontWeight={'semibold'} fontSize={'12px'} color='red' mt={2}>
                                    Tenía visita el día {dayjs(appointment_date).format('DD/MM')}
                                </Text>
                            }

                        </Flex>
                        <Flex flexDirection={'column'}>
                            <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'} ml={1}>
                                <MdIcon.MdOutlineTaskAlt style={{ display: 'inline' }} color={colorTask} />
                                <Text m={0} pl={1} color={color} fontSize={'12px'} fontWeight={'medium'}>
                                    {order + 1}    
                                </Text>  
                            </Box>
                        </Flex>

                    </Flex>
                    
                    <AccordionButton py={1} onClick={() => { setOpen(!open) }}>
                        <Box flex='1' justifyContent={'center'}>
                            <AiIcon.AiOutlineCaretDown style={{ display: 'inline' }} />
                        </Box>
                    </AccordionButton>
                        
                    <AccordionPanel px={1} pb={2}>
                        <CoordinateCard data={data} turns={turns} toast={toast} teams={teams} />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    )
}

const TeamCoordinatedEvents = ({data}) => {
    let colorBg = useColorModeValue('white', '#191d32');
    let colorBorder = useColorModeValue('#ff3300', '#101219');

    useEffect(() => {
        if(data){
            data.tickets == 1 && dayjs.tz().$H < 16? 
                toast.custom(
                    t => (
                        <Box backgroundColor={colorBg} borderRadius={10} border={`2px solid ${colorBorder}`} p={5} w={'md'}> 
                            <Text> El equipo {data.name} esta realizando su último ticket.</Text>
                            <Button mx={'44%'} mt={3} colorScheme={'red'} onClick={() => toast.dismiss(t.id)}>OK!</Button>
                        </Box>
                    ),
                    {
                        position: 'bottom-right',
                        duration: Infinity
                    }
                )
            : null
        }
    }, [data]);

    return(
        <Box m={4} p={3} borderRadius={10} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `} textAlign={'center'} 
            bg={data.tickets == 1? 'red.300' : 'white'} w={{base: '30%', md: '17%'}}>
            <Text > {data.name} </Text>
            <Text fontSize={20} > {data.tickets} </Text>
        </Box>
    )
}

export default Index;