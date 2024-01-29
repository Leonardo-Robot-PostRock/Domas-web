import CoordinateCard from '@/components/coordinateCard';

import { Badge, Box, Flex, Link, Tooltip, Text, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, ListItem, UnorderedList, Container } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { CgDanger } from 'react-icons/cg'
import { BsGearFill } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { BiSync } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import toast, { Toaster } from 'react-hot-toast';


const Coordinations = () => {
    const [coordinatedTk, setCoordinatedTk] = useState();
    const [notCoordinatedTk, setNotCoordinatedTk] = useState();
    const [programmedTk, setProgrammedTk] = useState();
    const [error, setError] = useState();

    const getMyEvents = async () => {
        const { data } = await axios.get(`${process.env.APP_URL}/api/coordinator/myCoordinations`)
        //console.log(data.tickets);
        return data.tickets;
    }

    
    useEffect(() => {
        const fetchEvents = getMyEvents();

        fetchEvents
        .then(res => {
            setCoordinatedTk(res.filter(event => event.ticket_status == 'COORDINADO'));
            setNotCoordinatedTk(res.filter(event => event.ticket_status == 'NO_COORDINADO'));
            setProgrammedTk(res.filter(event => event.ticket_status == 'PROGRAMADO'));
        })
        .catch(err => setError(err.response.data.message));
    
    }, [])

    return (        
        <Container maxW={'3xl'} spacing={{ base: 8, md: 14 }} centerContent
            py={{ base: 20, md: 25 }} mt={5} mb={5} backgroundColor={useColorModeValue('white', '#191d32')} borderRadius={10} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}>
            <Toaster 
            position="top-center"
            toastOptions={{
                duration: 8000
            }}
            />
            <Text mb={'30px'} fontSize='4xl' fontWeight={'bold'} textAlign={'center'}>Mis coordinaciones </Text>
            
            <UnorderedList listStyleType={"none"} ml={0} w='95%'>
                <Badge colorScheme='transparent' mt={1} mb={3}><Text as='u' fontSize={'15px'}> COORDINADOS </Text></Badge>
                { coordinatedTk ? 
                    <ListItem>
                        {
                            coordinatedTk.map(item => <TicketCard key={item.id} data={item} />)
                        }

                    </ListItem>
                    : error ?
                        <p style={{textAlign: 'center'}}> {error} </p>
                        :
                        <p>Cargando coordinaciones...</p>
                }
                
                <Badge colorScheme='transparent' mt={5} mb={3}><Text as='u' fontSize={'15px'}> CERRADOS </Text></Badge>
                { notCoordinatedTk ? 
                    <ListItem>
                        {
                            notCoordinatedTk.map(item => <TicketCard key={item.id} data={item} />)
                        }

                    </ListItem>
                    : error ?
                        <p style={{textAlign: 'center'}}> {error} </p>
                        :
                        <p>Cargando coordinaciones...</p>
                }

                <Badge colorScheme='transparent' mt={5} mb={3}><Text as='u' fontSize={'15px'}> PROGRAMADOS </Text></Badge>
                { programmedTk ? 
                    <ListItem>
                        {
                            programmedTk.map(item => <TicketCard key={item.id} data={item} />)
                        }

                    </ListItem>
                    : error ?
                        <p style={{textAlign: 'center'}}> {error} </p>
                        :
                        <p>Cargando programados...</p>
                }
                
            </UnorderedList>               

        </Container>        
    )
}


const TicketCard = ({ data }) => {
    const { customer, appointment_date, visiting_hours, Team, id, google_event_id, Ticket_history, ticket_status, recurrent } = data;
    let commentStatus = Ticket_history[Ticket_history.length - 1];
    let TurnColorSchema, TurnLabel;
    if (visiting_hours){
        TurnColorSchema = visiting_hours == 'afternoon' ? 'pink' : visiting_hours == 'morning' ? 'blue' : 'purple';
        TurnLabel = visiting_hours == 'afternoon' ? 'De 13 a 17hs.' : visiting_hours == 'morning' ? 'De 9 a 13hs.' : 'Todo el dia';
    }
    else {
        TurnColorSchema = ticket_status == 'NO COORDINADO' ? 'red' : ticket_status == 'PROGRAMADO' ? 'blue' : 'purple';
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [turns, setTurns] = useState(null);

    const turnsAvailable = async (team_id) => {
        let fetch = await axios.get(`/api/team/turnsAvailable?team_id=${team_id}`);
        setTurns(fetch.data);
    };

    useEffect(() => {
        if (isOpen){
            turnsAvailable(Team.id)
        }
    }, [isOpen]);

    return (
        <Box bg={useColorModeValue('#E3EAF2', '#2D354D')} borderRadius={'7px'} p={4} mt={2} flexDirection={'column'}>

            <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <Flex flexDirection={'column'}>
                    <Flex flexDirection={'row'} gap={4} >
                        <Tooltip label={`Turno de visita`}>
                            {
                                visiting_hours?
                                <Badge colorScheme={TurnColorSchema} mt={2} fontSize={'11px'} placeItems={'center'}  fontWeight={'semibold'}>
                                    {TurnLabel}
                                </Badge>
                                :
                                <Badge colorScheme={TurnColorSchema} mt={2} fontSize={'11px'} placeItems={'center'}  fontWeight={'semibold'}>
                                    {ticket_status}
                                </Badge>
                            }
                            
                        </Tooltip>

                        <Tooltip label={`Equipo de ST asignado`}>
                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                <AiIcon.AiOutlineTeam style={{ display: 'inline' }} color={useColorModeValue('#273D54', '#AAAFC5')} />
                                <Text m={0} color={useColorModeValue('#273D54', '#AAAFC5')} fontSize={'11px'} fontWeight={'semibold'}>
                                    {Team.name}
                                </Text>
                            </Badge>
                        </Tooltip>

                        <Tooltip label={`Día de visita`}>
                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                <MdIcon.MdDateRange style={{ display: 'inline' }} />
                                <Text m={0} color={useColorModeValue('#273D54', '#AAAFC5')} fontSize={'11px'}  fontWeight={'semibold'}>
                                    {appointment_date? dayjs.tz(appointment_date).format('DD/MM') : ''}
                                </Text>
                            </Badge>
                        </Tooltip>

                        <Tooltip label={`Ticket de mesa`}>
                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                <AiIcon.AiOutlineLink style={{ display: 'inline' }} />
                                <Text m={0} color={'blue.200'} fontSize={'11px'}  fontWeight={'semibold'}>
                                    <Link color='#0F66D5' href={`http://mesa.westnet.com.ar/ticket/ver/${id}`} isExternal>
                                        #{id}
                                    </Link>
                                </Text>
                            </Badge>
                        </Tooltip>

                        {recurrent != null && recurrent >= 1 &&
                            <Tooltip label={`Más de un ticket del área técnica en 6 meses. Enlace a Mesa al hacer click sobre la cantidad de tickets.`}>
                                <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                    <MdIcon.MdOutlineError style={{ display: 'inline' }} color={'#e60000'} />
                                    <Text m={0} color={'#e60000'} fontSize={'11px'}  fontWeight={'semibold'}>
                                        REITERADO (<Link href={`http://mesa.westnet.com.ar/ticket#codigo_cliente.${customer.code}`} isExternal>{recurrent} tickets</Link>)
                                    </Text>
                                </Badge>
                            </Tooltip>
                        }

                    </Flex>

                    <Text fontWeight={'semibold'} fontSize={'18px'} color={useColorModeValue('#273D54', '#AAAFC5')} mt={2}>
                        {customer.code} - {customer.lastname.toUpperCase()} {customer.name.toUpperCase()}
                    </Text>

                    <Text fontWeight={'medium'} fontSize={'12px'} color={useColorModeValue('#273D5466', '#AAAFC566')} mt={3}>
                        {   commentStatus && ticket_status == 'COORDINADO'?
                                `COORDINADO EL ${dayjs(commentStatus.createdAt).format('DD/MM/YYYY HH:mm')} HS.` 
                            :
                            commentStatus && ticket_status == 'NO_COORDINADO'?
                                `RAZON: ${commentStatus.description}`
                            : 
                            commentStatus && ticket_status == 'PROGRAMADO'? 
                                `${commentStatus.description}`
                            : null
                        }
                        
                    </Text>
                </Flex>

                <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'}>
                    {<Menu>
                        <MenuButton
                            px={4}
                            py={2}
                            transition='all 0.2s'
                            borderRadius='md'
                            borderWidth='1px'
                            border={`1px solid ${useColorModeValue('#273D5433','#AAAFC533')}`}
                        >
                            <BsGearFill />
                        </MenuButton>
                        <MenuList>
                            {
                                !google_event_id && <MenuItem gap={2} fontSize={'14px'}><BiSync />Sincronizar con Calendar</MenuItem>
                            }
                            <MenuItem gap={2} fontSize={'14px'} onClick={onOpen} ><FaPencilAlt />Editar</MenuItem>
                            <MenuItem gap={2} bg={'red'} color={'white'} _hover={{bg: '#F50000'}} fontSize={'14px'}>Cancelar</MenuItem>
                        </MenuList>
                    </Menu>}

                    <Tooltip label={google_event_id ? `Sincronizado con Calendar` : `Desincronizado con Calendar`}>
                        <span>
                            {
                                google_event_id ? <AiIcon.AiFillGoogleCircle size={25} color={'#38A169'} /> : <CgDanger size={25} color={'#D23F37'} />
                            }
                        </span>

                    </Tooltip> 

                    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'2xl'}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Edición de Evento</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <CoordinateCard data={data} turns={turns} toast={toast} />
                            </ModalBody>

                            <ModalFooter>
                                
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </Flex>

            </Flex>

        </Box>
    )
}


export default Coordinations;