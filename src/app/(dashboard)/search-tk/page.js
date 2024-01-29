import { Container, Box, Flex, Button, Badge, Text, Link, FormControl, FormLabel, Checkbox, Divider, Icon, Input, InputLeftAddon, InputGroup, Textarea, Tooltip  } from '@chakra-ui/react';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react'
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import axios from "axios";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { toastError, toastSuccess } from "@/components/Toast.js";
import toast, { Toaster } from "react-hot-toast";
import { Controller, set, useForm } from "react-hook-form";
import Select from "react-select";
import { IoLogoWhatsapp, IoMdPerson } from 'react-icons/io';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import CoordinateCard from "@/components/coordinateCard.js";

const ContextUpdateView = createContext();

const SearchTk = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataTicket, setDataTicket] = useState(null); 
    const [ticket, setTicket] = useState(null);
    const [updateInfo, setUpdateInfo] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();
    const { isOpen: isOpenCoordinate, onOpen: onOpenCoordinate, onClose: onCloseCoordinate } = useDisclosure();
    
    const handleSearch = async () => {
        setLoading(true);
        await axios.get(`/api/ticket/search?ticket_id=${ticket}`)
            .then(res => {
                //console.log(res.data);
                setDataTicket(res.data);
            })
            .catch(error => {
                //console.log(error);
                let message = error.response?.data?.message ?? 'Error al buscar el ticket.';
                toastError(message);
            })
            .finally(() => {
                setLoading(false);
                setUpdateInfo(null);
            });
    }

    useEffect(() => {
        if (updateInfo && ticket) {
            handleSearch();
        }
    }, [updateInfo]);
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            user.roles = user.roles.map(item => item.name);
            setUser(user);
        }
    }, []);

    return (
        <Container maxW={{ base: '100%', md: '90%' }} backgroundColor={'white'}
            borderRadius={10} border={`1px solid #E3EAF2`} p={{base: 2, md: 5}} mt={10}>
                <Toaster />
                <Text textAlign={'center'} fontWeight={'bold'} fontSize={'3xl'} mt={4} mb={4} color={'#319DA0'} > BUSCAR TICKET </Text>
                <Divider mb={5} mt={5} />

                <Flex direction={'row'} wrap={'wrap'} mb={5} alignItems={'center'} justifyContent={'center'} gap={5} >
                    <FormControl id="ticket" isRequired w={{base: '85%', md: '30%'}} >
                        <InputGroup>
                            <InputLeftAddon children='Ticket' />
                            <Input type="text" placeholder="564024" onChange={(e) => setTicket(e.target.value)} />
                        </InputGroup>
                    </FormControl>
                    <Button colorScheme="teal" size="md" isLoading={loading} loadingText='Cargando...' onClick={handleSearch} >Buscar</Button>
                </Flex>

                <Divider mb={5} mt={5} />

                <ContextUpdateView.Provider value={{ updateInfo, setUpdateInfo }}>
                {dataTicket && (
                    <Box >
                        <Text fontWeight={'bold'} fontSize={'xl'} mb={2} >Datos del ticket</Text>
                        <Flex direction={'row'} wrap={'wrap'} mb={5} justifyContent={'center'} gap={5} mx={5}>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >ID</Text>
                                <Text fontSize={'md'} mb={2} color={'teal.600'} >
                                    <Link href={`http://mesa.westnet.com.ar/ticket/ver/${dataTicket.id}`} isExternal> {dataTicket.id} <ExternalLinkIcon mx='2px' mb={'4px'} /></Link>
                                </Text>                                
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Categoría</Text>
                                <Text fontSize={'md'} mb={2} >{dataTicket.ticket_category}</Text>
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Area</Text>
                                <Text fontSize={'md'} mb={2} >{dataTicket.area ?? '-'}</Text>
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Estado</Text>
                                <Text fontSize={'md'} mb={2} >
                                    <Badge fontSize={'0.9em'} colorScheme={dataTicket.ticket_status == 'PENDIENTE' ? 'yellow' : dataTicket.ticket_status == 'COORDINADO' || dataTicket.ticket_status == 'EN_CURSO' ? 'green' : dataTicket.ticket_status == 'RECOORDINAR' ? 'blue' : dataTicket.ticket_status == 'NO_COORDINADO' || dataTicket.ticket_status == 'CERRADO' ? 'red' : dataTicket.ticket_status == 'VERIFICAR' || dataTicket.ticket_status == 'RESUELTO' ? 'purple' : 'gray'}>
                                        {dataTicket.ticket_status}
                                    </Badge>
                                </Text>
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Fecha de visita</Text>
                                {dataTicket.appointment_date ? (
                                    <Text fontSize={'md'} mb={2} >{dayjs(dataTicket.appointment_date).format('DD/MM/YYYY')}</Text>
                                ) : (
                                    <Text fontSize={'md'} mb={2} >-</Text>
                                )}                                
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Turno de visita</Text>
                                {dataTicket.visiting_hours ? (
                                    <Text fontSize={'md'} mb={2} >
                                        {dataTicket.visiting_hours == 'morning' ? 
                                            'Mañana' 
                                            : dataTicket.visiting_hours == 'afternoon' ?
                                                'Tarde'
                                                : 
                                                'Todo el día' 
                                        }
                                    </Text>
                                ) : (
                                    <Text fontSize={'md'} mb={2} >-</Text>
                                )}  
                                
                            </Box>                            
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Fecha de alta</Text>
                                <Text fontSize={'md'} mb={2} >{dayjs(dataTicket.ticket_created_at).format('DD/MM/YYYY HH:mm:ss')}</Text>
                            </Box>                            
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Fecha de cierre</Text>
                                
                                {dataTicket.closedAt ? (
                                    <Text fontSize={'md'} mb={2} >{dayjs(dataTicket.closedAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                ) : (
                                    <Text fontSize={'md'} mb={2} >-</Text>
                                )}
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} ></Box>  

                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Orden de Trabajo</Text>
                                <Text fontSize={'md'} mb={2} >{dataTicket.wo_worker} ({dayjs(dataTicket.wo_date).format('DD/MM/YYYY')})</Text>
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Cluster</Text>
                                <Text fontSize={'md'} mb={2} >{dataTicket.cluster?? '-'}</Text>
                            </Box>
                            <Box w={{base: '100%', md: '30%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={2} >Cuadrilla</Text>
                                <Text fontSize={'md'} mb={2} >{dataTicket.team_name?? '-'}</Text>
                            </Box>                                                     

                            <Box w={{base: '100%', md: '50%'}} >                                
                                <Accordion allowToggle>
                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton bg={'#ecf2f9'} _hover={{bg: '#d8e6f3'}}>
                                            <Box as="span" flex='1' textAlign='center'>
                                                <Text fontWeight={'bold'} fontSize={'md'} >Mostrar datos de cliente</Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <Text fontSize={'md'} mb={2} > <strong>Codigo:</strong> {dataTicket.customer.code}</Text>
                                            <Text fontSize={'md'} mb={2} > <strong>Nombre:</strong> {`${dataTicket.customer.lastname} ${dataTicket.customer.name}`.toUpperCase()}</Text> 
                                            <Text fontSize={'md'} mb={2} > <strong>Telefonos:</strong> {[dataTicket.customer.phone, dataTicket.customer.phone2, dataTicket.customer.phone3, dataTicket.customer.phone4].filter(p => p != '').join(', ')}</Text>
                                            <Text fontSize={'md'} mb={2} > <strong>Direccion:</strong> {dataTicket.customer.address}</Text>
                                            <Text fontSize={'md'} mb={2} > <strong>Geolocalización:</strong> <Link color={'teal.600'} href={`https://maps.google.com/?q=${dataTicket.customer.geocode.latitude},${dataTicket.customer.geocode.longitude}`} isExternal> Ver <ExternalLinkIcon mx='2px' mb={'4px'} /></Link></Text>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>                                                               
                            </Box>
                            <Box w={{base: '100%', md: '93%'}} >
                                <Text fontWeight={'bold'} fontSize={'md'} mb={4} >Historial del ticket en Do+</Text>
                                <Box display={{base: 'none', md: 'flex'}} mb={2} direction={'row'} wrap={'wrap'} gap={2} >
                                    <Text textAlign='center' fontSize={'md'} fontWeight={'bold'} mb={2} w={{base: '100%', md: '15%'}} >Fecha</Text>
                                    <Text textAlign='center' fontSize={'md'} fontWeight={'bold'} mb={2} w={{base: '100%', md: '20%'}} >Usuario</Text>
                                    <Text textAlign='center' fontSize={'md'} fontWeight={'bold'} mb={2} w={{base: '100%', md: '63%'}} >Descripción</Text>
                                </Box>
                                <Divider mb={2} border={'1px solid #008080'} w={'100%'}/>
                                {dataTicket.Ticket_history.map((h, i) => (
                                    <Flex key={i} mb={2} direction={'row'} wrap={'wrap'} gap={2}>
                                        <Text textAlign='center' fontSize={'md'} mb={2} w={{base: '45%', md: '15%'}} >{dayjs(h.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                        <Text textAlign='center' fontSize={'md'} mb={2} w={{base: '45%', md: '20%'}} >{h.worker_name}</Text>
                                        <Text fontSize={'md'} mb={2} w={{base: '100%', md: '63%'}} >{h.description}</Text>
                                        <Divider mb={2} border={'1px solid #008080'}/>
                                    </Flex>
                                ))}
                            </Box>

                            { user && user.roles.includes('SUPERVISOR') && 
                                <>
                                    <Button colorScheme='teal' onClick={onOpen} >Editar Estado</Button>
                                    <Button colorScheme='teal' onClick={onOpenDelegate} >Delegar</Button>
                                </>
                            }
                            { user && user.name == dataTicket.wo_worker && 
                                <Tooltip hasArrow placement='top' label={dataTicket.ticket_status == 'RESUELTO'? 'El ticket esta RESUELTO, no se puede editar' : 'Editar estado del ticket'} bg={dataTicket.ticket_status == 'RESUELTO'? 'red.600' : 'green.600'} color='white'>
                                    <Button colorScheme='teal' isDisabled={dataTicket.ticket_status == 'RESUELTO'} onClick={onOpenCoordinate} >Coordinar/Cerrar</Button>
                                </Tooltip>
                            }
                        </Flex>                        

                        <EditModal isOpen={isOpen} onClose={onClose} dataTicket={dataTicket} />
                        <DelegateModal isOpen={isOpenDelegate} onClose={onCloseDelegate} dataTicket={dataTicket} />
                        <CoordinateModal isOpen={isOpenCoordinate} onClose={onCloseCoordinate} dataTicket={dataTicket} />
                    </Box>
                )}
                </ContextUpdateView.Provider>

        </Container>
    )
}

const EditModal = ({ isOpen, onClose, dataTicket }) => {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [commentMesa, setCommentMesa] = useState(null);
    const [status, setStatus] = useState(null);
    const [alert, setAlert] = useState(false);

    const { control, handleSubmit } = useForm();
    const contextUpdate = useContext(ContextUpdateView);

    let options = [
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'CERRADO', label: 'CERRADO' },
    ]

    const onSubmit = () => {
        setLoadingSubmit(true);
       
        if (isChecked && !commentMesa) {
            setAlert(true);
            setLoadingSubmit(false);
            return false;
        } 

        let submitData = {
            ticket_status: status,
            tickets: [dataTicket],
            closeInMesa: isChecked,
            comment: commentMesa
        }

        axios.patch('/api/supervisor/changeStatusTickets', submitData)
            .then(res => {
                toastSuccess('El ticket se actualizo con éxito!');
                contextUpdate.setUpdateInfo(new Date());
            })
            .catch(err => {
                toastError('Ha ocurrido un error al intentar cambiar el estado del ticket.');
            })
            .finally(value => {
                setLoadingSubmit(false);
                handleOnClose();
            });
    }

    const handleOnClose = () => {
        setAlert(false);
        setIsChecked(false);
        setCommentMesa(null);

        onClose();
    }

    // Custom styles para el select de coordinadores y supervisores
    const customSelectStyles = {
        control: base => ({
            ...base,
            height: 40,
            minHeight: 35,
            fontSize: '14px'
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

    return (
        <Modal isOpen={isOpen} onClose={handleOnClose} size={'xl'} isCentered >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl id="status" mb={4}>
                            <FormLabel>Estado</FormLabel>
                            <Controller
                                control={control}
                                name="ticket_status"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={options}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                        onChange={e => setStatus(e.value)}
                                    />
                                )}
                            />
                        </FormControl>

                        <Checkbox onChange={(e) => setIsChecked(e.target.checked)}><Text fontSize={14}> Editar ticket en Mesa </Text></Checkbox>
                        { isChecked &&
                            <Textarea placeholder='Comentario para Mesa...' size='sm' mt={3} onChange={(e) => setCommentMesa(e.target.value)} />
                        }
                        { alert &&
                            <Alert status="error" px={4} py={2} fontSize={14}>
                                <AlertIcon />
                                <AlertDescription>
                                    <Text> Debe incluir un comentario para dejar en el ticket de Mesa </Text>
                                </AlertDescription>
                            </Alert>
                        }                    
                    
                        <Flex justifyContent='flex-end' mt={4} gap={2}>
                            <Button onClick={handleOnClose} >Cancelar</Button>
                            <Button colorScheme='blue' type='submit' isLoading={loadingSubmit} loadingText='Actualizando...' >Guardar</Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const DelegateModal = ({ isOpen, onClose, dataTicket }) => {
    const [coordinatorsOptions, setCoordinatorsOptions] = useState([]);
    const [supervisorOptions, setSupervisorOptions] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const alertDefault = {
        status: 'info',
        message: 'Seleccionar un coordinador o supervisor para delegar'
    }
    const [alert, setAlert] = useState(alertDefault);
    const contextUpdate = useContext(ContextUpdateView);


    const { control, handleSubmit } = useForm();
    const toast = useToast();
    const toastIdRefError = useRef();

    const closeErrorToast = () => {
        toast.close(toastIdRefError.current);
        toastIdRefError.current = null;
    }

    const onSubmit = data => {

        const { workerId, supervisorId } = data;

        if (workerId && supervisorId) {
            setAlert({ status: 'error', message: 'No puede seleccionar un coordinador y supervisor al mismo tiempo' })
        }
        else if (workerId || supervisorId) {
            setLoadingSubmit(true);

            let worker = workerId ? workerId : supervisorId;
            dataTicket.order_id = dataTicket.wo_id;
            //dataTicket.ticket_status = 'PENDIENTE';
            delete dataTicket.wo_id;

            axios.post('/api/supervisor/delegateTickets', {
                workerId: worker.value,
                tickets: [dataTicket]
            })
                .then(res => {
                    const { status, data } = res;

                    if (status == 206) {
                        
                        toastIdRefError.current = toast({
                            duration: null,
                            position: "top-center",
                            render: () => (
                                <Flex alignItems={'center'} gap={'25px'} flexDir={'row'} p={3} borderRadius={10} borderColor={"red.500"} borderWidth={3}  bg={"red.100"} shadow={'xl'} fontSize={'15px'}>
                                    <Box >
                                        <Text fontWeight={'bold'}>{data.message}</Text>
                                        <List spacing={3}>
                                            {
                                                data.ticketsFail.map((ticket, i) => <ListItem key={i} display={'flex'} alignItems={'center'}><ListIcon as={FaTimesCircle} color={"red.500"} /> {ticket.message}</ListItem>)
                                            }
                                        </List>
                                    </Box>
                                    <Box style={{ cursor: 'pointer' }} onClick={closeErrorToast}>
                                        <FaTimes color="rgb(102, 0, 0)" />
                                    </Box>
                                </Flex>
                            )
                        })

                    } else {
                        toastSuccess('Se delego el ticket con exito!');
                        contextUpdate.setUpdateInfo(new Date());
                        onClose();
                    }                   
                    
                })
                .catch(err => {
                    //console.log(err);
                    toastError(err.response?.data?.message || 'Ha ocurrido un error al intentar delegar el ticket.');
                })
                .finally(value => setLoadingSubmit(false))
        }
        else { setAlert({ status: 'error', message: 'Se debe seleccionar un coordinador o un supervisor' }) }
    };

    useEffect(() => {

        if(isOpen){
            axios.get('/api/supervisor/getMyWorkers')
            .then(res => {
                setCoordinatorsOptions(res.data.workers.map((worker, i) => {
                    return {
                        minHeight: 35,
                        label: <Flex key={i} flexDir={'row'} alignItems={'center'} gap={3}><Icon as={worker.name.toLowerCase().includes('whatsapp') ? IoLogoWhatsapp : IoMdPerson} color={worker.name.toLowerCase().includes('whatsapp') ? '#2AD348' : '#285E61'} size={'22px'} key={i} />{worker.name}</Flex>,
                        value: worker.id
                    }
                }))

                setSupervisorOptions(res.data.supervisors.map((worker, i) => {
                    return {
                        label: <Flex key={i} flexDir={'row'} alignItems={'center'} gap={3}><Icon as={worker.name.toLowerCase().includes('whatsapp') ? IoLogoWhatsapp : IoMdPerson} color={worker.name.toLowerCase().includes('whatsapp') ? '#2AD348' : '#285E61'} size={'22px'} key={i} />{worker.name}</Flex>,
                        value: worker.id
                    }
                }))
            })
            .catch(err => console.error(err))
        }

    }, [isOpen])

    // Custom styles para el select de coordinadores y supervisores
    const customSelectStyles = {
        control: base => ({
            ...base,
            height: 40,
            minHeight: 35,
            fontSize: '14px'
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


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delegar tickets</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl>
                            <FormLabel>Coordinador</FormLabel>
                            <Controller
                                control={control}
                                name="workerId"
                                /* rules={{ required: true, }} */
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={coordinatorsOptions}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                    />

                                )}
                            />
                            <FormLabel mt={3}>Supervisor</FormLabel>
                            <Controller
                                control={control}
                                name="supervisorId"
                                /* rules={{ required: true, }} */
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={supervisorOptions}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                    />

                                )}
                            />
                        </FormControl>
                        <Alert status={alert.status} py={1} mt={2}>
                            <AlertIcon />
                            <AlertTitle fontWeight={'medium'} fontSize={'13px'}> {alert.message} </AlertTitle>
                        </Alert>
                        <Flex mt={5} justifyContent={'flex-end'}>
                            <Button fontWeight={'normal'} onClick={() => { onClose(); setAlert(alertDefault) }} mr={3} isDisabled={loadingSubmit}>Cancelar</Button>
                            <Button fontWeight={'normal'} colorScheme='blue' type="submit" isLoading={loadingSubmit} loadingText={'Delegando tickets...'}>
                                Delegar
                            </Button>
                        </Flex>

                    </form>

                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

const CoordinateModal = ({ isOpen, onClose, dataTicket }) => {
    const [teams, setTeams] = useState([]);
    const [turns, setTurns] = useState(null);

    useEffect(() => {
        if(isOpen){
            axios.get(`/api/team/turnsAvailable?team_id=${dataTicket.team_id}`)
            .then(res => {
                setTurns(res.data);
            })
            .catch(err => {
                toast.custom(
                    t => (
                        <Box backgroundColor={'white'} borderRadius={10} border={`4px solid #ff3300`} p={3} maxW={'xl'}> 
                            <Text> {err.response?.data || 'Error al cargar los turnos disponibles'} para la cuadrilla {dataTicket.team_name}. </Text>
                            <Text fontSize={14} mt={3}> Tip: consulte los días libres de la cuadrilla. </Text>
                            <Button mx={'44%'} mt={3} colorScheme={'red'} onClick={() => toast.dismiss(t.id)}>OK!</Button>
                        </Box>
                    ),
                    {
                        position: 'bottom-center',
                        duration: Infinity
                    }
                );
                return false;
            });

            axios.get(`${process.env.APP_URL}/api/supervisor/getMyTeams`)
            .then(response => {
                //console.log(response);
                setTeams(response.data);
                return true;
            })
            .catch(err => {
                //console.log(err);
                toastError(err.response?.data?.message || 'Error al cargar las cuadrillas');
                return false;
            });
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Coordinar Ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody mb={3}>
                    { dataTicket && turns && teams.length > 0 &&
                        <CoordinateCard data={dataTicket} turns={turns} toast={toast} teams={teams} />
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default SearchTk;
