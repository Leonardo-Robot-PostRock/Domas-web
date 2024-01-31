import Layout from "@/components/layout";
import fetcher from "@/utils/Fetcher";
import { Box, Container, Flex, FormLabel, Heading, ListItem, Text, Tooltip, UnorderedList, useColorModeValue, Badge, Link, Menu, MenuButton, MenuList, MenuItem, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, Button, Textarea, FormErrorMessage, Alert, AlertIcon, Spinner, Icon } from "@chakra-ui/react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es'
import "react-datepicker/dist/react-datepicker.css"
import { createContext, use, useContext, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import dayjs from "dayjs";
import Select from 'react-select';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { FaLink, FaUnlink, FaRegQuestionCircle } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { currentDatetime, currentDatetimeObject, datetimeDiff, datetimeFormatted, datetimeFromNow } from "@/utils/Datetime";
import 'dayjs/locale/es';
import { capitalizeWords, replaceSpecialChars } from "@/utils/String";
import { toastError, toastSuccess } from "@/components/Toast";
import { RiHomeWifiFill } from 'react-icons/ri';
import { BrowserView, MobileView } from "react-device-detect";

registerLocale("es", es);

// VARIABLES GLOBALES
const selectCustomStylesGlobal = {
    control: base => ({
        ...base,
        height: 40,
        minHeight: 35
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '14px'
    }),
    placeholder: base => ({
        ...base,
        fontSize: '14px'
    })
};

let teamsGlobal = [];
let datetimeGlobal = null;
let ticketsGlobal = [];
let teamsUrl = null;
let ticketsFetchUrl = null;
// FIN VARIABLES GLOBALES

const ContextReloadRoadmap = createContext();

// Componente que sirve como columna para los tickets
const EventContainer = ({ title, data }) => {

    return (

        <Box borderRadius={7} backgroundColor={'rgb(155 155 155 / 15%)'} p={4} w={{ base: '100%', '2xl': '31%' }}>

            <Text size='md' fontWeight={'bold'} textAlign={'center'}>
                {title} {data ? data.length : 0} TICKETS
            </Text>

            {
                data?.length > 0 ?
                    <UnorderedList mt={5} listStyleType={'none'} mx={0}>
                        {
                            data.map((ticket, i) => {

                                return (<ListItem key={i}>
                                    <EventCard ticket={ticket} />
                                </ListItem>)
                            })
                        }
                    </UnorderedList> :
                    <Text mt={5} textAlign={'center'} color={'#00000057'}>No hay tickets</Text>
            }
        </Box>

    )
}

// Componente de tarjeta de ticket
const EventCard = ({ ticket }) => {


    const { id, appointment_date, visiting_hours, team, customer, ticket_status, roadmap_ranking, ticket_history } = ticket;

    const TurnColorSchema = visiting_hours == 'afternoon' ? 'pink' : visiting_hours == 'morning' ? 'blue' : 'purple';
    const TurnLabel = visiting_hours == 'afternoon' ? 'De 13 a 17hs.' : visiting_hours == 'morning' ? 'De 9 a 13hs.' : 'Todo el dia';

    //Variable de estado para el estado de la conexion del cliente
    // status: null, 'online', 'offline', 'loading'
    // verifiedAt: null, new Date()
    const [connectionStatus, setconnectionStatus] = useState({ status: null, tech: null, verifiedAt: null });

    // Funcion que recibe el estado de la conexion
    function handleConnectionStatus (status, tech) {
        setconnectionStatus({ status, tech, verifiedAt: new Date() });
    }

    return (
        <Box bg={useColorModeValue('white', '#2D354D')} borderRadius={'7px'} p={4} mt={2} flexDirection={'column'}>

            <Flex flexDirection={'row'} justifyContent={'space-between'} >
                <Flex flexDirection={'column'} width={'100%'} gap={5}>
                    {
                        (datetimeDiff(ticket.appointment_date, currentDatetime()) < 0 && ticket.ticket_status != 'RESUELTO') &&
                        <Tooltip label={`Este ticket aparece porque fue visto por el tecnico el día ${datetimeFormatted(ticket.appointment_date, 'DD/MM')}, pero aún no fue cerrado.`}>
                            <Alert status='warning' cursor={'help'} rounded={'xl'}>
                                <AlertIcon />
                                <Text fontSize={'12px'}>
                                    El técnico se olvidó de cerrar el ticket.
                                </Text>
                            </Alert>
                        </Tooltip>

                    }
                    <Flex flexDir={'row'} gap={3} justifyContent={'space-between'}>
                        <Flex flexDir={'column'}>
                            <Flex flexDirection={'row'} gap={3} flexWrap={'wrap'}>

                                <Tooltip label={`Turno de visita ${TurnLabel.toLowerCase()}`}>
                                    <Badge colorScheme={TurnColorSchema} mt={2} fontSize={'12px'} placeItems={'center'}>
                                        {TurnLabel}
                                    </Badge>
                                </Tooltip>

                                {
                                    team && <Tooltip label={`Asignado a ${team.name.toUpperCase()}`}>
                                        <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                            <AiIcon.AiOutlineTeam style={{ display: 'inline' }} size={'14px'} color={useColorModeValue('#273D54', '#AAAFC5')} />
                                            <Text m={0} color={useColorModeValue('#273D54', '#AAAFC5')} fontSize={'12px'}>
                                                {team.name}
                                            </Text>
                                        </Badge>
                                    </Tooltip>
                                }


                                <Tooltip label={`Visita el ${datetimeFormatted(appointment_date, 'DD/MM')}`}>
                                    <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <MdIcon.MdDateRange style={{ display: 'inline' }} size={'14px'} />
                                        <Text m={0} color={useColorModeValue('#273D54', '#AAAFC5')} fontSize={'12px'}>
                                            {datetimeFormatted(appointment_date, 'DD/MM')}
                                        </Text>
                                    </Badge>
                                </Tooltip>

                                <Tooltip label={`Ticket de mesa #${id}`}>
                                    <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <AiIcon.AiOutlineLink style={{ display: 'inline' }} size={'14px'} />
                                        <Text m={0} color={'blue.200'} fontSize={'12px'}>
                                            <Link color='#0F66D5' href={`http://mesa.westnet.com.ar/ticket/ver/${id}`}>
                                                {`#${id}`}
                                            </Link>
                                        </Text>
                                    </Badge>
                                </Tooltip>

                                <Tooltip label={'Orden de visita (rojo significa sin geo)'}>
                                    <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <AiIcon.AiOutlineFieldNumber style={{ display: 'inline' }} size={'14px'} />
                                        <Text m={0} color={customer.geocode.latitude ? '#273D54' : 'red'} fontSize={'12px'}>
                                            {roadmap_ranking}
                                        </Text>
                                    </Badge>
                                </Tooltip>

                            </Flex>

                            <Flex gap={2} alignContent={'center'} mt={1}>

                                <BrowserView>
                                    {
                                        connectionStatus.status == 'loading'? 
                                        <Tooltip label={'Verificando estado de conexión...'}>
                                            <Spinner mt={2} mr={2} height={'2vh'} width={'2vh'} />
                                        </Tooltip>
                                        :
                                        connectionStatus.status == null || connectionStatus.status == 'unknown' ? 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Desconocido.<br/>` }} />} isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={FaRegQuestionCircle} style={{ display: 'inline' }} boxSize={4} />
                                            </Badge>
                                        </Tooltip>
                                        :
                                        connectionStatus.status == 'online'? 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Online.<br/> ${connectionStatus.verifiedAt ? `Verificado ${datetimeFromNow(connectionStatus.verifiedAt)}` : ''}` }} />}
                                            isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={connectionStatus.tech == 'wireless' ? MdIcon.MdOutlineSignalWifiStatusbar4Bar : FaLink} style={{ display: 'inline' }} boxSize={4} color={'#45B05F'} />
                                            </Badge>
                                        </Tooltip>
                                        :
                                        connectionStatus.status == 'offline' && 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Sin conexión.<br/> ${connectionStatus.verifiedAt ? `Verificado ${datetimeFromNow(connectionStatus.verifiedAt)}` : ''}` }} />}
                                            isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={connectionStatus.tech == 'wireless' ? MdIcon.MdOutlineSignalWifiOff : FaUnlink} style={{ display: 'inline' }} boxSize={4} color={'red'} />
                                            </Badge>
                                        </Tooltip>
                                    }
                                </BrowserView>
                                <MobileView>
                                    {
                                        connectionStatus.status == 'loading'? 
                                        <Tooltip label={'Verificando estado de conexión...'}>
                                            <Spinner mt={2} mr={2} height={'3vh'} width={'3vh'} />
                                        </Tooltip>
                                        :
                                        connectionStatus.status == null || connectionStatus.status == 'unknown' ? 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Desconocido.<br/>` }} />}
                                            isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={FaRegQuestionCircle} style={{ display: 'inline' }} boxSize={4} />
                                            </Badge>
                                        </Tooltip>
                                        :
                                        connectionStatus.status == 'online' ? 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Online.<br/> ${connectionStatus.verifiedAt ? `Verificado ${datetimeFromNow(connectionStatus.verifiedAt)}` : ''}` }} />}
                                            isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={connectionStatus.tech ? MdIcon.MdOutlineSignalWifiStatusbar4Bar : FaLink} style={{ display: 'inline' }} boxSize={4} color={'#45B05F'} />
                                            </Badge>
                                        </Tooltip>
                                        :
                                        connectionStatus.status == 'offline' && 
                                        <Tooltip label={<span dangerouslySetInnerHTML={{ __html: `Estado de conexión: Sin conexión.<br/> ${connectionStatus.verifiedAt ? `Verificado ${datetimeFromNow(connectionStatus.verifiedAt)}` : ''}` }} />}
                                            isTruncated maxW="320px">
                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <Icon as={connectionStatus.tech ? MdIcon.MdOutlineSignalWifiOff : FaUnlink} style={{ display: 'inline' }} boxSize={4} color={'red'} />
                                            </Badge>
                                        </Tooltip>
                                    }
                                </MobileView>


                                <Text fontWeight={'bold'} fontSize={'15px'} color={useColorModeValue('#273D54', '#AAAFC5')} mt={2}>
                                    {customer.code} - {`${customer.name.toUpperCase()} ${customer.lastname.toUpperCase()}`}
                                </Text>
                            </Flex>

                            <Flex flexDirection={'row'} alignContent={'center'} mt={1}>
                                <Text fontWeight={'medium'} fontSize={'13px'} color={useColorModeValue('#273D54', '#AAAFC5')}>
                                    {`Coordinado el ${dayjs(ticket_history.createdAt).format('DD/MM/YY HH:mm')}hs por ${ticket_history.coordinator}`}
                                </Text>
                            </Flex>

                        </Flex>
                        <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'}>
                            <MenuAction ticket={ticket} connectionStatus={(status, tech) => handleConnectionStatus(status, tech)} />
                        </Flex>
                    </Flex>



                </Flex>



            </Flex>

        </Box>
    )

}

// Menu para desplegar las acciones de cada ticket
const MenuAction = ({ ticket, connectionStatus }) => {
    const [statusChecked, setStatusChecked] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isReorderOpen, onOpen: onReorderOpen, onClose: onReorderClose } = useDisclosure();
    const initialRef = useRef()
    const finalRef = useRef()

    const [actionButton, setActionButton] = useState('');

    function handleAction (action) {
        setActionButton(action);
        onOpen();
    }

    function handleChangeOrder () {
        onReorderOpen();
    }

    function handleCheckStatus () {
        connectionStatus('loading')
        axios.get(`/api/okam/status/${ticket.customer.code}?ticket_id=${ticket.id}`)
            .then(res => {

                connectionStatus('online', res.data.tech);
                //toastSuccess(`Cliente ${ticket.customer.code} cuenta con conexión!`);
                setStatusChecked(true);

            }
            ).catch(err => {
                //get http status destructuring
                const { status } = err.response;
                const tech = err.response?.data?.okam_response?.tech || null;

                if (status == 404) {
                    connectionStatus('unknown', tech);
                    //toastError(`Cliente ${ticket.customer.code} no se encontró en Disponibilidad`);
                }
                else if (status >= 400 && status < 500) {
                    connectionStatus('offline', tech);
                    //toastError(`Cliente ${ticket.customer.code} no cuenta con conexión`);
                } else {
                    //toastError(`Hubo un error al verificar el estado de conexión del cliente ${ticket.customer.code}`);
                    connectionStatus('unknown', tech);
                }

                setStatusChecked(false);

            })

    }

    /* useEffect(() => {
        handleCheckStatus();
    },[]) */


    return (
        <>
            <Menu>
                <MenuButton
                    px={2}
                    py={1}
                    transition='all 0.2s'
                    borderRadius='md'
                    borderWidth='1px'
                    border={'none'}
                    backgroundColor={'#EBEBEB'}
                    _hover={{ backgroundColor: '#E0E0E0' }}
                    _active={{ backgroundColor: '#CCCCCC' }}
                >
                    <FiMoreHorizontal size={20} />

                </MenuButton>
                <MenuList fontSize={13}>

                    {
                        ticket.ticket_status != 'EN_CURSO' && ticketsGlobal.filter(t => t.team_id == ticket.team_id && t.ticket_status == 'COORDINADO').length > 1 && <MenuItem onClick={() => handleChangeOrder()}>Cambiar orden de visita</MenuItem>
                    }

                    <BrowserView>
                        {
                            ticket.ticket_status != 'EN_CURSO' && <MenuItem onClick={() => handleAction('change.team')} display={'flex'} gap={1}><AiIcon.AiOutlineCar size={'1.5vh'} mr={'3vh'} /> Cambiar equipo</MenuItem>
                        }

                        <MenuItem onClick={() => handleAction('recoordinate')} display={'flex'} gap={1}><MdIcon.MdOutlineChangeCircle size={'1.5vh'} />Recoordinar ticket</MenuItem>

                        <MenuItem onClick={() => handleCheckStatus('verificar conexión')} display={'flex'} gap={1}><RiHomeWifiFill size={'1.5vh'} /> Verificar conexión </MenuItem>

                        <MenuItem onClick={() => handleAction('close.ticket')} display={'flex'} gap={1}><MdIcon.MdFileDownloadDone size={'1.5vh'} /> Cerrar como RESUELTO
                            {
                                datetimeFormatted(currentDatetime(), 'DD-MM-YYYY') <= '31-03-2023' && <Badge colorScheme='green'>
                                    Nuevo
                                </Badge>
                            }
                        </MenuItem>
                    </BrowserView>

                    <MobileView>
                        {
                            ticket.ticket_status != 'EN_CURSO' && <MenuItem onClick={() => handleAction('change.team')} display={'flex'} gap={1}><AiIcon.AiOutlineCar size={'2.5vh'} mr={'3vh'} /> Cambiar equipo</MenuItem>
                        }

                        <MenuItem onClick={() => handleAction('recoordinate')} display={'flex'} gap={1}><MdIcon.MdOutlineChangeCircle size={'2.5vh'} />Recoordinar ticket</MenuItem>
                        
                        <MenuItem onClick={() => handleCheckStatus('verificar conexión')} display={'flex'} gap={1}><RiHomeWifiFill size={'2.5vh'} /> Verificar conexión </MenuItem>

                        <MenuItem onClick={() => handleAction('close.ticket')} display={'flex'} gap={1}><MdIcon.MdFileDownloadDone size={'2.5vh'} /> Cerrar como RESUELTO
                            {
                                datetimeFormatted(currentDatetime(), 'DD-MM-YYYY') <= '31-03-2023' && <Badge colorScheme='green'>
                                    Nuevo
                                </Badge>
                            }
                        </MenuItem>
                    </MobileView>

                </MenuList>
            </Menu>
            <ModalAction isOpen={isOpen} onClose={onClose} initialRef={initialRef} finalRef={finalRef} action={actionButton} ticket={ticket} connection={statusChecked} />

            {
                ticketsGlobal.filter(t => t.team_id == ticket.team_id && t.ticket_status == 'COORDINADO').length > 1 && <ReorderModal isOpen={isReorderOpen} onClose={onReorderClose} ticket={ticket} />
            }

        </>
    )
}

// Modal para cambiar de equipo o recoordinar ticket
const ModalAction = ({ isOpen, onClose, initialRef, finalRef, action, ticket, connection }) => {

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();

    const reloadContext = useContext(ContextReloadRoadmap);

    const showTeamField = action.includes('team');

    const teamOptions = teamsGlobal.map(item => {
        if (item.value == ticket.team_id) {
            return { ...item, label: `${item.label} (actual)` }
        }

        return item;
    });

    const onSubmit = data => {
        setLoadingSubmit(true);

        data.ticket_id = ticket.id;

        if (action.includes('recoordinate')) {
            data.team = ticket.team;
            data.google_event_id = ticket.google_event_id;
            data.traccar_geofence_id = ticket.traccar_geofence_id;

            axios.put(`api/ticket/recoordinate?ticket_id=${ticket.id}`, data)
            .then(res => {
                toastSuccess('Ticket recoordinado con exito!');
                onClose();
            })
            .catch(err => {
                console.error(err);
                toastError('Ha ocurrido un error al recoordinar el ticket.');
            })
            .finally(value => {
                setLoadingSubmit(false);
                reloadContext.setFetchData(new Date());
            });
            

        } else if (action.includes('close.ticket')) {
            
            axios.put(`api/ticket/close?ticket_id=${ticket.id}`, data)
            .then(res => {
                toastSuccess('Ticket cerrado con exito!');
                onClose();
            })
            .catch(err => {
                console.error(err);
                toastError('Ha ocurrido un error al cerrar el ticket.');
            })
            .finally(value => {
                setLoadingSubmit(false);
                reloadContext.setFetchData(new Date());
            });

            
        } else {
            data.team_id = data.team.value;

            axios.put(`api/ticket/changeTeam?ticket_id=${ticket.id}`, data)
            .then(res => {
                toastSuccess('Ticket actualizado con exito!');
                onClose();
            })
            .catch(err => {
                console.error(err);
                toastError('Ha ocurrido un error al actualizar el ticket.');
            })
            .finally(value => {
                setLoadingSubmit(false);
                reloadContext.setFetchData(new Date());
            });            

        }

    };


    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{showTeamField ? `Cambiar de equipo #${ticket.id}` : action.includes('recoordinate')? `Marcar para recoordinar #${ticket.id}` : `Cerrar ticket #${ticket.id}`} </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6} >

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {
                            showTeamField &&
                            <FormControl>
                                <FormLabel fontSize={'3xl'} fontWeight={'bold'} display={'-webkit-inline-flex'}>Equipo <Text ml={1} color={'red.500'}>*</Text></FormLabel>
                                <Controller
                                    control={control}
                                    name="team"
                                    rules={{ required: true, }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            styles={selectCustomStylesGlobal}
                                            closeMenuOnSelect={true}
                                            options={teamOptions}
                                            placeholder={'Seleccionar...'}
                                        />

                                    )}
                                />
                                {
                                    errors.team && <Text mt={1} color={'red.500'} fontSize={'12px'}>El campo es obligatorio</Text>
                                }
                            </FormControl>
                        }

                        {
                            action.includes('close.ticket') &&
                            <Box>                                 
                                <Text fontSize={18} fontWeight={'bold'} display={'-webkit-inline-flex'}>¿Está seguro de cerrar el ticket?</Text>
                                <Text mt={4}><Icon as={MdIcon.MdDoneOutline} color={connection? 'green.500' : 'red.500'} /> El cliente {connection? 'cuenta' : 'no cuenta'} con conexión.</Text>
                            </Box>
                        }

                        <FormControl mt={4}>
                            <FormLabel fontSize={'3xl'} fontWeight={'bold'} >Observación</FormLabel>
                            <Textarea autoFocus={!showTeamField} maxH={'250px'} {...register("ticket_comment", { required: action.includes('close.ticket')? true : false })}></Textarea>
                            {
                                errors.ticket_comment && <Text mt={1} color={'red.500'} fontSize={'12px'}>El campo es obligatorio</Text>
                            }
                        </FormControl>

                        {
                            action.includes('close.ticket') &&
                            <FormControl mt={4}>
                                <FormLabel fontSize={'3xl'} fontWeight={'bold'} >Ticket de Llamada de verificación</FormLabel>
                                <Text fontSize={14} mb={2}>Se debe incluir un comentario para crear el ticket de verificación.</Text>
                                <Textarea autoFocus={!showTeamField} maxH={'250px'} {...register("ticket_verification_comment", { required: true })}></Textarea>
                                {
                                    errors.ticket_verification_comment && <Text mt={1} color={'red.500'} fontSize={'12px'}>El campo es obligatorio</Text>
                                }
                            </FormControl>
                        }

                        <Flex mt={4} flexDir={'row'} gap={3} justifyContent={'right'}>
                            <Button onClick={onClose} isDisabled={loadingSubmit}>Cancelar</Button>
                            <Button type="submit" colorScheme='blue' isDisabled={loadingSubmit} isLoading={loadingSubmit} loadingText={'Actualizando...'}>
                                Actualizar
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

// Modal para cambiar el orden de los tickets
const ReorderModal = ({ isOpen, onClose, ticket }) => {

    const [teamEvents, setTeamEvents] = useState();
    const [positions, setPositions] = useState();
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const dragItem = useRef();
    const dragOverItem = useRef();

    const reloadContext = useContext(ContextReloadRoadmap);


    const dragStart = (e, index) => {
        dragItem.current = index;
    };

    const dragEnter = (e, index) => {
        dragOverItem.current = index;
    };

    const drop = (e) => {
        const copyListItems = [...teamEvents];
        const dragItemContent = copyListItems[dragItem.current];

        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);

        dragItem.current = null;
        dragOverItem.current = null;

        for (let i = 0; i < copyListItems.length; i++) {
            copyListItems[i].roadmap_ranking = positions[i];
        }

        setTeamEvents(copyListItems);
    };

    const reorderReq = async () => {
        setLoadingSubmit(true);

        const tickets = teamEvents.map(item => ({ id: item.id, roadmap_ranking: item.roadmap_ranking }));

        axios.put('api/roadmap/changeRanking', tickets)
        .then(res => {
            onClose();
            toastSuccess('Orden de visita actualizado con exito!');
        })
        .catch(err => {
            console.error(err);
            toastError('Ha ocurrido un error al actualizar el orden de visita.');
        })
        .finally(value => {
            setLoadingSubmit(false);
            reloadContext.setFetchData(new Date());
        });

    }

    useEffect(() => {

        if (ticket && ticketsGlobal.length > 0) {
            let events = ticketsGlobal.filter(t => t.team_id == ticket.team_id && t.ticket_status == 'COORDINADO');

            setTeamEvents(events);
            setPositions(events.map(e => e.roadmap_ranking));
        }
    }, [ticket]);




    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={'gray.100'} >
                <ModalHeader textAlign={'center'}>Cambiar orden de visita {ticket.team.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {teamEvents &&
                        teamEvents.map((ticket, i) => {
                            return (
                                <Box bg={'white'} borderRadius={'7px'} p={4} mt={2} flexDirection={'column'}
                                    key={i}
                                    onDragStart={(e) => dragStart(e, i)}
                                    onDragEnter={(e) => dragEnter(e, i)}
                                    onDragEnd={drop}
                                    draggable>
                                    <Flex flexDirection={'column'}>
                                        <Flex flexDirection={'row'} gap={3} flexWrap={'wrap'}>
                                            <Badge colorScheme={ticket.visiting_hours == 'afternoon' ? 'pink' : ticket.visiting_hours == 'morning' ? 'blue' : 'purple'} mt={2} fontSize={'11px'} placeItems={'center'}>
                                                {ticket.visiting_hours == 'afternoon' ? 'De 13 a 17hs.' : ticket.visiting_hours == 'morning' ? 'De 9 a 13hs.' : 'Todo el dia'}
                                            </Badge>

                                            {
                                                ticket.team && <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                    <AiIcon.AiOutlineTeam style={{ display: 'inline' }} color={'#273D54'} />
                                                    <Text m={0} color={'#273D54'} fontSize={'11px'}>
                                                        {ticket.team.name}
                                                    </Text>
                                                </Badge>
                                            }


                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <MdIcon.MdDateRange style={{ display: 'inline' }} />
                                                <Text m={0} color={'#273D54'} fontSize={'11px'}>
                                                    {datetimeFormatted(ticket.appointment_date, 'DD/MM')}
                                                </Text>
                                            </Badge>

                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <AiIcon.AiOutlineLink style={{ display: 'inline' }} />
                                                <Text m={0} color={'blue.500'} fontSize={'11px'}>
                                                    {`#${ticket.id}`}
                                                </Text>
                                            </Badge>

                                            <Badge display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                                <AiIcon.AiOutlineFieldNumber style={{ display: 'inline' }} />
                                                <Text m={0} color={'#273D54'} fontSize={'11px'}>
                                                    {ticket.roadmap_ranking}
                                                </Text>
                                            </Badge>



                                        </Flex>
                                        <Text fontWeight={'bold'} fontSize={'15px'} color={'#273D54'} mt={2}>
                                            {`${ticket.customer.code} - ${ticket.customer.name.toUpperCase()} ${ticket.customer.lastname.toUpperCase()}`}
                                        </Text>
                                    </Flex>
                                </Box>
                            )
                        })
                    }

                </ModalBody>

                <ModalFooter>
                    <Button variant={'outline'} mr={3} onClick={onClose} isDisabled={loadingSubmit}>  Cancelar  </Button>
                    <Button colorScheme='blue' onClick={reorderReq} isDisabled={loadingSubmit} isLoading={loadingSubmit} loadingText={'Actualizando...'}> Cambiar Orden </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

// Componente principal
const Index = () => {

    const [datetime, setDatetime] = useState(currentDatetimeObject)
    const [teamsSelected, setTeamsSelected] = useState([])
    const [userInfo, setUserInfo] = useState(null);
    const [reload, setReload] = useState(new Date())
    const [auxData, setAuxData] = useState([]);
    const [fetchData, setFetchData] = useState(new Date());

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserInfo(user);
    }, [])


    let teamOptions = [];

    if (userInfo) {
        teamsUrl = userInfo.roles.some(item => item.name.toUpperCase() == 'ADMINISTRADOR') ? '/api/teams/all' : '/api/teams/getMyTeams';
    }
    const { data: teamsReq } = useSWR(teamsUrl, fetcher);
    //TODO - Mostrar toastr si hay error en la request anterior

    if (teamsReq && !teamsReq.error) {
        teamOptions = teamsReq.map(item => ({ label: item.name, value: item.id }))
        teamsGlobal = teamOptions;
    }

    const dateFormatted = datetimeFormatted(datetime, 'YYYY-MM-DD');
    datetimeGlobal = dateFormatted;
    ticketsFetchUrl = `/api/roadmap?date=${dateFormatted}`;
    const { data: ticketsReq, error } = useSWR(`/api/roadmap?date=${dateFormatted}`, fetcher);

    //TODO - Mostrar toastr si hay error en la request anterior
    if (ticketsReq && !ticketsReq.error) {
        ticketsGlobal = ticketsReq.data;
    }

    // useEffect usado para actualizar la variable auxData cuando se actualiza la variable ticketsReq
    useEffect(() => {

        if (ticketsReq?.data) {
            setAuxData(ticketsReq.data);
        }
    }, [ticketsReq])


    // Funcion para filtrar los tickets
    function handleSearchKeyWord (value) {

        // function to handle search keyword and filter tickets data
        const filteredData = auxData.filter(item => {
            item.visiting_hours_label = item.visiting_hours == 'afternoon' ? 'De 13 a 17hs.' : item.visiting_hours == 'morning' ? 'De 9 a 13hs.' : 'Todo el dia';
            item.ticket_status_label = item.ticket_status == 'COORDINADO' ? 'Pendiente' : item.ticket_status == 'EN_CURSO' ? 'En curso' : 'Resuelto';

            return item.customer.name.toLowerCase().includes(value.toLowerCase()) ||
                item.customer.lastname.toLowerCase().includes(value.toLowerCase()) ||
                item.customer.code.toLowerCase().includes(value.toLowerCase()) ||
                item.id.toString().includes(value.toLowerCase()) ||
                item.team.name.toLowerCase().includes(value.toLowerCase()) ||
                item.visiting_hours_label.toLowerCase().includes(value.toLowerCase()) ||
                item.ticket_status_label.toLowerCase().includes(value.toLowerCase())
        }
        )


        ticketsReq.data = filteredData;
        setReload(new Date());

    }

    useEffect(() => {

        if (ticketsReq?.data) {
            if (teamsSelected.length > 0) {
                const filteredData = auxData.filter(item => {

                    return teamsSelected.includes(item.team_id);
                }
                )


                ticketsReq.data = filteredData;
            }
            else {
                ticketsReq.data = auxData;
            }


            setReload(new Date());

        }

    }, [teamsSelected])

    useEffect(() => {
        if(fetchData){
            mutate(`/api/roadmap?date=${dateFormatted}`, null, true);
        }
    }, [fetchData])


    const headingDatetime = `${capitalizeWords(replaceSpecialChars(dayjs(datetime).locale('es').format('dddd DD')))} de ${dayjs(datetime).locale('es').format('MMMM')} de ${dayjs(datetime).locale('es').format('YYYY')}`;

    return (
        <>
            <Toaster />
            <Container maxW={{ base: '98%', '2xl': '90%' }}>
                <Box p={5} mb={5} backgroundColor={'white'}
                    borderRadius={10} border={`1px solid #E3EAF2`} mt={10}>

                    <Text textAlign={'center'} fontWeight={'bold'} fontSize={'4xl'} mt={4} mb={8} color={'#319DA0'}>HOJAS DE RUTA - {headingDatetime}</Text>

                    <Flex flexDir={'column'}>
                        <FormLabel fontSize={'3xl'} fontWeight={'bold'} >Fecha</FormLabel>
                        <ReactDatePicker
                            placeholderText='25/04/2022'
                            dateFormat={'dd/MM/yyyy'}
                            onChange={(date) => setDatetime(date)}
                            selected={datetime}
                            locale={'es'}
                        />
                        <FormLabel mt={5} fontSize={'3xl'} fontWeight={'bold'} >Equipo</FormLabel>
                        <Select
                            instanceId="select"
                            styles={selectCustomStylesGlobal}
                            isMulti
                            closeMenuOnSelect={false}
                            options={teamOptions}
                            placeholder={'Seleccionar...'}
                            onChange={(value) => setTeamsSelected(value.map(team => team.value))} />
                        <FormLabel mt={5} fontSize={'3xl'} fontWeight={'bold'} >Buscar</FormLabel>
                        <Input autoFocus={true} placeholder='446389' size='md' onChange={(e) => handleSearchKeyWord(e.currentTarget.value)} />
                    </Flex>
                    
                    <ContextReloadRoadmap.Provider value={{ fetchData: fetchData, setFetchData: setFetchData }}>
                    <Flex mt={10} gap={3} justifyContent={'center'} wrap={'wrap'}>
                        {
                            ticketsReq && !ticketsReq.error && <EventContainer title={'PENDIENTE'} data={ticketsReq.data.filter(item => (item.ticket_status == 'COORDINADO'))} />
                        }
                        {
                            ticketsReq && !ticketsReq.error && <EventContainer title={'EN CURSO'} data={ticketsReq.data.filter(item => (item.ticket_status == 'EN_CURSO'))} />
                        }
                        {
                            ticketsReq && !ticketsReq.error && <EventContainer title={'RESUELTO'} data={ticketsReq.data.filter(item => (item.ticket_status == 'RESUELTO'))} />
                        }

                    </Flex>
                    </ContextReloadRoadmap.Provider>
                </Box>

            </Container>
        </>
    )
}



export default Index;