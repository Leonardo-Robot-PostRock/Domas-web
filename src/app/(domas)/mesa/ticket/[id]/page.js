import { Container, Box, Flex, Button, Badge, Text, Tooltip, Icon, IconButton, Spinner, Image } from '@chakra-ui/react';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from "axios";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { toastError, toastSuccess } from "@/components/Toast.js";
import { Toaster } from "react-hot-toast";
import { EditTicket, CoordinateTicket } from '@/components/Ticket';
import { MdFiberManualRecord, MdWifiPassword } from "react-icons/md";
import { FiCheck, FiX, FiHelpCircle, FiMapPin } from "react-icons/fi";
import Link from 'next/link';
import Photos from '@/components/Photos';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Mendoza');

const Index = ({ data }) => {
    const [customer, setCustomer] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [alert, setAlert] = useState();
    const [pingCustomer, setPingCustomer] = useState(false);
    const [pingAp, setPingAp] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);
    const [reloadPhotos, setReloadPhotos] = useState(null);
    const [hasGeo, setHasGeo] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCoordinateOpen, onOpen: onCoordinateOpen, onClose: onCoordinateClose } = useDisclosure();

    let categories = ['SIN INTERNET','SIN INTERNET FO', 'ANTI-BAJA SERVICIO TÉCNICO', 'CLIENTE REITERA RECLAMO'];

    useEffect(() => {
        //console.log(data);
        if(data.error) {
            setAlert(data.message);
        }
        else {
            if(data.customer.error)
                setAlert('No se pudo obtener datos del cliente. Verifique el estado en Gestion');
            else{
                setCustomer(data.customer);
                setHasGeo(data.customer.geocode.latitude? true : false);
            }
            //data.ticket.categoria = 'SIN INTERNET FO';
            setTicket(data.ticket);
        }
    }, [data]);

    useEffect(() => {
        if(customer){
            axios.get(`/api/utility/ping?ip=${customer.connection.ip}`)
            .then(res => {
                setPingCustomer(res.data);
            })
            .catch(err => {
                //console.log(err);
                toastError('Error al hacer ping al cliente');
            });   
            
            if(customer.connection.ip_ap) {
                axios.get(`/api/utility/ping?ip=${customer.connection.ip_ap}`)
                .then(res => {
                    setPingAp(res.data);
                })
                .catch(err => {
                    //console.log(err);
                    toastError('Error al hacer ping al AP');
                });
            }
        }
    }, [customer]);

    useEffect(() => {
        if(ticket) {
            setIsFetchingPhotos(true);
            axios.get(`/api/mesa/ticket/photos?ticket_id=${ticket.id}`)
                .then(res => {
                    //console.log(res.data);
                    setPhotos(res.data.photos);
                })
                .catch(err => {
                    //console.log(err);
                    toastError('Error al obtener las fotos del ticket');
                })
                .finally(() => {
                    setIsFetchingPhotos(false);
                });
        }
    }, [ticket, reloadPhotos]);

    const columns = [
        {
            name: 'Fecha',
            width: '12%',
        },
        {
            name: 'Por',
            width: '14%',
        },
        {
            name: 'Categoría',
            width: '15%',
        },
        {
            name: 'Descripción',
            width: '30.5%',
        },
        {
            name: 'Asignado',
            width: '14%',
        },
        {
            name: 'Estado',
            width: '14.5%',
        }
    ]

    
    return (
        <Container maxW={{ base: '100%', md: '90%' }} p={{ base: 2, md: 5 }} mt={10} bg={'white'} rounded={'lg'}>
            <Toaster />
            { (!ticket && !customer && !alert) &&
                <Box w={'100%'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Spinner size='xl' color="brand.900"/>
                </Box>
            }
            { alert && 
                <Box w={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} mb={4}>
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>{alert}</AlertTitle>
                    </Alert>
                </Box>             
            }
             
            <Box display={'flex'} flexDirection={'column'}>
                <Text fontWeight={'bold'} fontSize={'2xl'} mb={4}>{'Ticket #'}{ticket?.id || ''}</Text>
                <Box display={'flex'} flexDirection={{ base: 'column', md: 'row'}} p={4} w={'100%'} gap={6} justifyContent={'space-between'}>
                    <Box w={{ base: '100%', md: '65%'}} display={'flex'} flexDirection={'column'} gap={6}>                            
                        { customer &&
                            <CustomerData customer={customer} pingCustomer={pingCustomer} pingAp={pingAp} />
                        }                            
                    </Box>
                    <Box w={{ base: '100%', md: '35%'}} display={'flex'} flexDirection={'column'} gap={2} border={'1px solid #3973ac'} rounded={'lg'} px={6} py={4}>
                        <Text mt={-7} bg={'white'} px={2} w={'fit-content'}>Ticket</Text>
                        { ticket &&
                            <>
                                <TicketData ticket={ticket} />

                                <Box display={'flex'} flexDirection={'row'} w={'100%'} mt={10} mx={'auto'} justifyContent={'center'} gap={4}>
                                    <Button w={'40%'} colorScheme={'telegram'} onClick={onOpen}>Editar</Button>
                                    <EditTicket ticket={ticket} isOpen={isOpen} onClose={onClose} />

                                    <Button w={'40%'} colorScheme={'purple'} onClick={onCoordinateOpen} isDisabled={!categories.includes(ticket.categoria.toUpperCase())}>Coordinar</Button>
                                    <CoordinateTicket ticket={ticket} geo={hasGeo} isOpen={isCoordinateOpen} onClose={onCoordinateClose} />
                                </Box>
                            </>
                        }
                    </Box>
                </Box>
                <Box p={4} >
                    { ticket &&
                        <>
                            <Text fontWeight={'bold'} fontSize={'xl'} mb={2}>Descripción </Text>
                            <Text> {ticket.historial[0].descripcion} </Text>
                        </>                            
                    }
                </Box>
                <Box p={4}>
                    <Text fontWeight={'bold'} fontSize={'xl'} mb={2}> Fotos </Text>
                    { isFetchingPhotos?
                        <Box p={4} w={'100%'} display={'flex'} alignItems={'center'}>
                            <Spinner size='md' color="blue.700"/>
                            <Text fontSize={'sm'} ml={3}>Cargando fotos...</Text>
                        </Box>
                        :
                        <Photos photos={photos} ticket_id={ticket?.id} reload={setReloadPhotos} />
                    }
                </Box>
                <Box p={4} >
                    { ticket &&
                        <>                                
                            <Text fontWeight={'bold'} fontSize={'xl'} mb={2}>Historial </Text>
                            {/* Vista PC */}
                            <Box display={{ base: 'none', md: 'flex'}} flexDirection={'row'} w={'100%'}>
                                { columns.map((c, i) => (
                                        <Box border={'1px solid #3973ac'} bg={'#4080bf'} color={'white'} w={c.width} key={i} px={6} py={3}  >
                                            <Text textAlign={'center'} fontWeight={'bold'}>{c.name}</Text>
                                        </Box>                                        
                                    ))
                                }
                            </Box>    
                            <Box display={{ base: 'none', md: 'flex'}} flexDirection={'column'} w={'100%'}>
                                { ticket.historial.map((h, i) => {
                                        return (
                                            <Box display={'flex'} flexDirection={'row'} w={'100%'} key={i} fontSize={'sm'}>
                                                <Box border={'1px solid #d1d1e0'} w={'12%'} p={2} py={3}>
                                                    <Text textAlign={'center'}>{dayjs(h.fecha_actualizacion).format('DD/MM/YYYY HH:mm')}</Text>
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'14%'} px={2} py={3}>
                                                    <Text textAlign={'center'}>{h.autor}</Text>
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'15%'} px={2} py={3}>
                                                    <Text textAlign={'center'}>{h.categoria}</Text>
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'30.5%'} px={2} py={2}>
                                                    {h.descripcion.split('\n').map((l, i) => <Text key={i} my={1}>{l}</Text>)}
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'14%'} px={2} py={3}>
                                                    <Text textAlign={'center'}>{h.asignado}</Text>
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'14.5%'} px={2} py={3} textAlign={'center'} overflow={'auto'}>
                                                    <Badge colorScheme={h.estado == 'nuevo' ? 'red' : h.estado.includes('en curso') ? 'orange' : h.estado == 'en espera' ? 'blue' : h.estado.includes('no resuelto') ? 'purple' : 'green'}>
                                                        {h.estado}
                                                    </Badge>
                                                </Box>
                                            </Box>
                                        ) 

                                    })
                                }
                            </Box>    
                            {/* Vista Mobil */}        
                            <Box display={{ base: 'flex', md: 'none'}} flexDirection={'row'} w={'100%'}>
                                <Box border={'1px solid #3973ac'} bg={'#4080bf'} color={'white'} w={'25%'} p={2}>
                                    <Text textAlign={'center'} fontWeight={'bold'}>Fecha</Text>
                                </Box>
                                <Box border={'1px solid #3973ac'} bg={'#4080bf'} color={'white'} w={'75%'} p={2}>
                                    <Text textAlign={'center'} fontWeight={'bold'}>Descripción</Text>
                                </Box>
                            </Box>    
                            <Box display={{ base: 'flex', md: 'none'}} flexDirection={'column'} w={'100%'}>
                                { ticket.historial.map((h, i) => {
                                        return (
                                            <Box display={'flex'} flexDirection={'row'} w={'100%'} key={i} fontSize={'sm'}>
                                                <Box border={'1px solid #d1d1e0'} w={'25%'} p={2}>
                                                    <Text textAlign={'center'}>{dayjs(h.fecha_actualizacion).format('DD/MM/YY HH:mm')}</Text>
                                                </Box>
                                                <Box border={'1px solid #d1d1e0'} w={'75%'} p={2}>
                                                    <Text><strong>Por:</strong> {h.autor}</Text>
                                                    <Text><strong>Categoría:</strong> {h.categoria}</Text>
                                                    <Text><strong>Descripción:</strong></Text>
                                                    {h.descripcion.split('\n').map((l, i) => <Text key={i} ml={2} my={1}>{l}</Text>)}
                                                    <Text><strong>Asignado:</strong> {h.asignado}</Text>
                                                    <Text><strong>Estado:</strong>
                                                        <Badge colorScheme={h.estado == 'nuevo' ? 'red' : h.estado.includes('en curso') ? 'orange' : h.estado == 'en espera' ? 'blue' : h.estado.includes('no resuelto') ? 'purple' : 'green'}>
                                                            {h.estado}
                                                        </Badge>
                                                    </Text>
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>                
                        </>                            
                    }
                </Box>
            </Box>                
        </Container>
    )
}


const CustomerData = ({ customer, pingCustomer, pingAp }) => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const [passError, setPassError] = useState(false);
    const hasGeo = customer.geocode.latitude? true : false;

    const { onOpen, onClose, isOpen } = useDisclosure();

    const getCpeKey = () => {
        setLoading(true);
        axios.get(`/api/utility/cpe-password?ip=${customer.connection.ip}`)
        .then(res => {
            setPassword(res.data.password);
        })
        .catch(err => {
            //console.log(err);
            toastError('Error al obtener la clave del CPE');
            setPassError(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <Box display={'flex'} flexDirection={'column'} border={'1px solid #3973ac'} rounded={'lg'} px={6} py={4} gap={2}>
                <Text mt={-7} bg={'white'} px={2} w={'fit-content'}>Cliente</Text>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                    <Text fontWeight={'bold'} fontSize={'xl'} mb={1}> {customer.code} - {customer.lastname} {customer.name} </Text>
                    { hasGeo?
                        <Link href={`https://mesa.westnet.com.ar/mapa/clientes/${customer.code}:${customer.contract_id}`} target='_blank'>
                            <Icon as={FiMapPin} boxSize={5} color={'#00cc00'} />
                        </Link>
                        :
                        <div className='tooltip'>
                            <span className='tooltiptext'> No tiene geo </span>
                            <Icon as={FiMapPin} boxSize={5} color={'#ff3300'} />
                        </div>                      
                    }                    
                </Box>
                <Text><strong>Contrato: </strong> 
                    {customer.contract_status === 'active' ? <Badge colorScheme='green'>Activo</Badge> 
                        : customer.contract_status == 'low-process' ? <Badge colorScheme='yellow'>En proceso de baja</Badge> 
                            : customer.contract_status == 'low' ? <Badge colorScheme='red'>Baja</Badge>
                                : <Badge>Desconocido</Badge>}
                </Text>
                <Text><strong>Estado de Cuenta: </strong> 
                    {customer.account_status === 'enabled' ? <Badge colorScheme='green'>Normal</Badge> 
                        : customer.account_status === 'clipped' ? <Badge colorScheme='orange'>Corte con aviso</Badge> 
                            : customer.account_status == 'forced' ? <Badge colorScheme='yellow'>Forzada</Badge>
                                : customer.account_status == 'low' ? <Badge colorScheme='red'>Baja</Badge>
                                    : customer.account_status == 'defaulter' ? <Badge colorScheme='orange'>Moroso</Badge>
                                        : <Badge>Desconocido</Badge>}
                </Text>
                <Text><strong>Dirección:</strong> {customer.address}</Text>
                <Text><strong>Teléfonos:</strong> {[customer.phone, customer.phone2, customer.phone3, customer.phone4].filter(item => item != '').join(', ')}</Text>
            </Box>
            <Box display={'flex'} flexDirection={'column'} border={'1px solid #3973ac'} rounded={'lg'} px={6} py={4} gap={2}>
                <Text mt={-7} bg={'white'} px={2} w={'fit-content'}>Conexión</Text>
                <Text><strong>Nodo:</strong> {customer.connection.node}</Text>                
                <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
                    <Text><strong>SSID:</strong> {customer.connection.ssid ? <Link href={`http://${customer.connection.ip_ap}`} target='_blank' style={{color: '#3973ac', textDecoration: 'underline'}}>{customer.connection.ssid}</Link> : '-'}</Text>
                    { pingAp ?
                        pingAp.alive ? 
                            <Tooltip hasArrow label={'El equipo responde correctamente'} placement={'top'} rounded={'md'}>
                                <IconButton aria-label={'Ping'} rounded={'full'} size={'xs'} colorScheme={'green'} icon={<FiCheck />} />
                            </Tooltip>
                            :
                            <Tooltip hasArrow label={'El equipo no responde'} placement={'top'} rounded={'md'}>
                                <IconButton aria-label={'Ping'} rounded={'full'} size={'xs'} colorScheme={'red'} icon={<FiX />} />
                            </Tooltip>                      
                        :
                        null
                    }
                </Box>
                <Text><strong>Plan:</strong> {customer.connection.plan}</Text>
                <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
                    <Text><strong>IP:</strong> <Link href={`http://${customer.connection.ip}`} target='_blank' style={{color: '#3973ac', textDecoration: 'underline'}}>{customer.connection.ip}</Link></Text>
                    { pingCustomer ?
                        pingCustomer.alive ? 
                            <Tooltip hasArrow label={'El equipo responde correctamente'} placement={'top'} rounded={'md'}>
                                <IconButton aria-label={'Ping'} rounded={'full'} size={'xs'} colorScheme={'green'} icon={<FiCheck />} />
                            </Tooltip>
                            :
                            <Tooltip hasArrow label={'El equipo no responde'} placement={'top'} rounded={'md'}>
                                <IconButton aria-label={'Ping'} rounded={'full'} size={'xs'} colorScheme={'red'} icon={<FiX />} />
                            </Tooltip>                       
                        :
                        <Icon as={FiHelpCircle} color={'gray'} />
                    }      
                    { customer.connection.technology == 'Wireless' &&
                        <Tooltip hasArrow label={'Clave CPE'} placement={'top'} rounded={'md'}>
                            <Box display={'flex'} justifyContent={'center'}>
                                <Popover
                                    isOpen={isOpen}
                                    onOpen={onOpen}
                                    onClose={onClose}
                                    placement='bottom'
                                    closeOnBlur={false}
                                >
                                    <PopoverTrigger>
                                        <IconButton aria-label={'Clave CPE'} rounded={'full'} size={'xs'} colorScheme={'purple'} icon={<MdWifiPassword />} />
                                    </PopoverTrigger>
                                    <PopoverContent color={'white'} bg={'blue.800'} borderColor={'blue.800'}>
                                        <PopoverArrow bg={'blue.800'}/>
                                        <PopoverCloseButton />
                                        <PopoverHeader>Consultar clave</PopoverHeader>
                                        <PopoverBody p={4} display={'flex'} flexDirection={'column'} gap={3}>
                                            <Text>Clave: {password ? password : passError ? '- No se encontro la clave -' : ''}</Text>
                                            <Button w={'40%'} size={'sm'} colorScheme={'blue'} onClick={getCpeKey} isLoading={loading} alignSelf={'center'} isDisabled={passError}>Buscar</Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>                                
                            </Box>
                        </Tooltip>
                    }              
                </Box>
                <Text><strong>Estado de Conexión: </strong> 
                    {customer.connection.status == 'enabled' ? <Badge colorScheme='green'>Habilitada</Badge>
                        : customer.connection.status == 'forced' ? <Badge colorScheme='yellow'>Forzada</Badge>
                            : customer.connection.status == 'low' ? <Badge colorScheme='red'>Baja</Badge> 
                                : <Badge colorScheme='orange'>Deshabilitada</Badge>}  
                </Text>
            </Box>
        </>
    )
}


const TicketData = ({ ticket }) => {
    return (
        <>
            <Text><strong>Creado por:</strong> {ticket.autor}</Text>
            <Text><strong>Asignado a:</strong> {ticket.asignado}</Text>
            <Text><strong>Categoria:</strong> {ticket.categoria.toUpperCase()}</Text>
            <Text><strong>Estado:</strong> 
                <Badge ml={2} colorScheme={ticket.estado == 'nuevo' ? 'red' : ticket.estado.includes('en curso') ? 'orange' : ticket.estado == 'en espera' ? 'blue' : ticket.estado.includes('no resuelto') ? 'purple' : 'green' }>
                    {ticket.estado}
                </Badge>
            </Text>                            
            <Text><strong>Alta:</strong> {dayjs(ticket.fecha_alta).tz('America/Argentina/Mendoza').format('DD/MM/YYYY HH:mm')}</Text>
            <Text><strong>Actualización:</strong> {dayjs(ticket.fecha_actualizacion).tz('America/Argentina/Mendoza').format('DD/MM/YYYY HH:mm')}</Text>
            <Text><strong>Cierre:</strong> {ticket.fecha_cierre? dayjs(ticket.fecha_cierre).tz('America/Argentina/Mendoza').format('DD/MM/YYYY HH:mm') : '-'}</Text>
            <Text><strong>Turno de visita:</strong> {ticket.fecha_coordinacion? dayjs(ticket.fecha_coordinacion).format('DD/MM/YYYY') : '-'}</Text>
            <Text><strong>Etiquetas:</strong> {ticket.etiquetas ? '' : 'No hay etiquetas'}</Text>
            <Box display={'flex'} gap={2} flexWrap={'wrap'} maxH={'100px'} overflowY={'auto'}>
                {ticket.etiquetas && ticket.etiquetas.map((tag, i) => {
                    return (
                        <Tooltip key={i} label={`Por ${tag.usuario} (${dayjs(tag.fecha).tz('America/Argentina/Mendoza').format('DD/MM/YYYY HH:mm')})`}>
                            <Box display={'flex'} alignItems={'center'} border={'1px solid #3973ac'} p={1} rounded={'lg'} bg={'white'} fontSize={'12px'} cursor={'pointer'}>
                                <Icon as={MdFiberManualRecord} color={tag.color} mr={1} />
                                <Text> 
                                    {tag.etiqueta} 
                                </Text>
                            </Box>
                        </Tooltip>
                    )
                })}
            </Box>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const cookie = ctx.req.cookies['auth_service'];

    const response = await axios.get(`${process.env.AUTH_BASE_URL}/v1/ticket/mesa/${ctx.query.id}`, {
        headers: {
            'Cookie': `auth_service=${cookie}`
        }
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error.response.data);
            return { error: true, message: 'Hubo un error al obtener la información del Ticket.' }
        });
    

    return {
        props: {
            data: response
        }
    }
}

export default Index;