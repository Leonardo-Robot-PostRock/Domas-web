import { Alert, AlertIcon, AlertTitle, Badge, Box, Button, Checkbox, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, StackDivider, Text, Textarea, useColorModeValue, useDisclosure, VStack, Icon } from "@chakra-ui/react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, AlertDescription } from '@chakra-ui/react'
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "@/utils/Fetcher";
import { AiOutlineEye, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import { SlRocket } from "react-icons/sl";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import Select from "react-select";
import { calculateDistance, getCurrentGeolocation, calculateCluster } from "@/utils/Geolocation";
import { VisitingHourBadge } from "@/components/VisitingHourBadge";
import { toastError, toastSuccess } from "@/components/Toast";
import toast, { Toaster } from "react-hot-toast";
import FormExecutedTasks from "@/components/FormExecutedTasks.js";
import { FaCheck, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { NapearModalBajas, NapearModalInstalaciones } from "@/components/NapearModal";
import { customerIsFTTH } from "@/utils/CustomerIsFTTH";
import { CustomModal } from "@/components/CustomModal";
import { parseCookies } from "nookies";
import { currentDatetime, datetimeDiff, datetimeFromNow, startOfDate, tomorrowDatetime } from "@/utils/Datetime";
import MyForm from "@/components/FormInstalacionesRecoordinar";
import { checkClosedTicketStatus } from "@/utils/CheckStatus";


// Variable donde guardo la informacion del tecnico logueado
let globalUser;

/**
 * Modal para mostrar al querer cerrar un ticket como resuelto si el ticket es de ST
 */
const ModalCierreTicketSt = ({ ticket, onClose, isOpen }) => {
    const { control, register, watch, handleSubmit, formState: { errors } } = useForm();
    const [button, setButton] = useState({
        disabled: false,
        text: ''
    })
    const [stockOptions, setstockOptions] = useState([]);
    const recoordinateReasons = [
        'Cliente no se encuentra en el domicilio',
        'Falta de tiempo',
        'Condiciones climatológicas',
        'Falta de materiales adecuados',
        'Corte de luz',
        'Zona Roja'
    ]
    const [recoordinateOptions, setRecoordinateOptions] = useState([]);
    const [tasksForm, setTasksForm] = useState(null);
    const [okamVerify, setOkamVerify] = useState({
        verified: false,
        status: null,
        message: null   
    });
    const [isLoading, setIsLoading] = useState(false);
    const updateGeocodeChecked = watch("update_geocode");

    const verifyConnection = async () => {
        setOkamVerify({
            verified: false,
            status: null,
            message: null
        });

        setIsLoading(true);

        let verification = await checkClosedTicketStatus(ticket);
        setIsLoading(false);
        
        if (verification.error) {
            setOkamVerify({
                verified: true,
                status: 'unknown',
                message: verification.message
            });
        }

        setOkamVerify({
            verified: true,
            status: verification.status,
            message: verification.diagnostic
        });
    }

    const onSubmit = async data => {

        if(ticket.status == 'resuelto' && !okamVerify.verified) {
            toastError('Debe verificar la conexión del cliente con Okam antes de cerrar el Ticket.');
            return false;
        }

        if (tasksForm) {
            const { main_category, stock_type, problem, cause } = tasksForm;

            if (main_category, problem, cause) {
                if (main_category.label == 'Drop' && !stock_type) {
                    toastError("Debe seleccionar el tipo de drop encontrado en el cliente.");
                    return false;
                }
                else if(main_category.label == 'Router' && !stock_type) {
                    toastError("Debe seleccionar el tipo de router encontrado en el cliente.");
                    return false;
                }
                else if(main_category.label == 'ONU' && !stock_type) {
                    toastError("Debe seleccionar el tipo de onu encontrada en el cliente.");
                    return false;
                }
            }
            else {
                toastError("Falta completar el formulario de Tareas Realizadas.\nDebe seleccionar la causa principal, cual fue el problema y que lo causo en detalle.");
                return false;
            }
        }
        else if (!tasksForm && ticket.status == 'resuelto') {
            toastError('Debe completar el formulario de Tareas Realizadas.');
            return false;
        }

        setButton({ disabled: true, text: ticket.status == 'resuelto' ? 'Cerrando...' : 'Informando...' });

        ticket.comment = ticket.status == 'resuelto' ? data.comment == ''? 'ST finalizado.' : data.comment : data.reason.label;
        ticket.delete_geofence = true;
        ticket.delete_ticket_calendar = ticket.status == 'recoordinar' ? true : false;

        if (data.stocks_id) {
            ticket.stocks_id = data.stocks_id.map(item => item.value);
        }

        if (data.update_geocode) {
            // Verificar distancia entre la geo del ticket y la del tecnico
            const { geocode } = ticket.customer;

            // Variable que uso como bandera para saber si debo pedir la ubicacion del tecnico
            let getGeocode = false;
            if (geocode.latitude && geocode.longitude) {
                try {
                    const distancia = await calculateDistance(geocode.latitude, geocode.longitude);

                    if (distancia > 50 || !distancia) {
                        getGeocode = true;
                    }
                } catch (error) {
                    toastError('Para cerrar el ticket, debe permitir que DO+ tome la ubicación del dispositivo');
                    setButton({ disabled: false, text: 'Cerrar ticket' });

                    return false;
                }

            } else {
                getGeocode = true;
            }

            if (getGeocode) {
                const geolocation = await getCurrentGeolocation();

                const { latitude, longitude } = geolocation;

                axios
                    .post('/api/supervisor/changeGeo', { coordinates: `${latitude},${longitude}`, ticket: ticket, update_order: false })
                    .catch(err => {
                        //console.error(err);
                        toastError(err.response.data.message || 'Ha ocurrido un error al intentar cambiar la geo.');
                    });
            }

        }

        if (tasksForm) {
            tasksForm.ticket_id = ticket.id;
            tasksForm.team_id = ticket.team_id;
            tasksForm.main_category = tasksForm.main_category.value;

            axios
                .post('/api/technician/saveTasksLogForm', tasksForm)
                .catch(err => console.error(err));
        }

        if(ticket.status == 'resuelto') {
            ticket.okamReport = okamVerify.status; 
        }

        axios.post('/api/technician/updateTicket', ticket)
            .then(res => {
                setButton({ disabled: false, text: ticket.status == 'resuelto' ? 'Cerrar ticket' : 'Informar ticket' });
                localStorage.removeItem('napear');
                toastSuccess('Ticket actualizado');

                if(res.data.verify && res.data.verify.status == 200) {
                    toastSuccess('Ticket verificado con éxito.');
                    setTimeout(() => {
                        toast.remove();
                        onClose(true);                        
                    }, 1000);
                }
                else if (res.data.verify && res.data.verify.status >= 400) {
                    toast(
                        (t) => (
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} bg={'#FCEDEA'}>
                                <Icon as={AiOutlineWarning} w={8} h={8} color='red.600' mb={3} />
                                <Text mb={3}> Error al verificar el ticket en Mesa. Informe a soporte para que lo verifique. </Text>
                                <Button size={'sm'} colorScheme={"red"} onClick={() => {toast.dismiss(t.id); onClose(true);}}>Siguiente Ticket</Button>
                            </Box>
                        ),
                        {
                            duration: Infinity,
                            style: {
                                border: '3px solid #f0775c',
                                backgroundColor: '#FCEDEA',
                                borderRadius: '15px',
                                boxShadow: '0px 2px 22px 0px rgba(235,78,44,0.20)'
                        }
                        }
                    );
                }
                else {
                    onClose(true);
                }
            })
            .catch(err => {
                toastError('Error al actualizar el ticket');
            });

    };

    useEffect(() => {        
        if (ticket.status) {            
            setButton({ 
                disabled: false, 
                text: ticket.status == 'resuelto' ? 'Cerrar ticket' : 'Informar ticket' 
            });

            if(ticket.status == 'recoordinar') {
                setRecoordinateOptions(recoordinateReasons.map((reason, index) => {
                    return {
                        label: reason,
                        value: index
                    }
                }))
            }
        }
    }, [ticket.status]);

   

    const customSelectStyles = {
        control: base => ({
            ...base,
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px'
        }),
        placeholder: base => ({
            ...base,
            fontSize: '14px'
        }),
        noOptionsMessage: base => ({
            ...base,
            fontSize: '14px'
        })
    };

    function loadStockOptions (value) {
        return new Promise((resolve, reject) => {
            let data = stockOptions.filter(item => {
                const { label } = item;

                return label.toUpperCase().includes(value.toUpperCase());

            });
            resolve(data);
        })

    }

    async function handleStockInputChange (value) {

        if (value.length >= 2) {

            try {
                const reqStock = await axios.get('/api/technician/getStock', {
                    params: {
                        value: value,
                        mesa_username: globalUser.mesa_username
                    }
                });

                const { data } = reqStock;

                let parseData = data.map(item => {
                    return {
                        value: item.id,
                        label: item.serie
                    }

                });

                setstockOptions(parseData);

            } catch (error) {
                setstockOptions([]);
            }

        } else {
            setstockOptions([]);
        }

    }

    useEffect(() => {
        if(!isOpen){
            setOkamVerify({
                verified: false,
                status: null,
                message: null
            });
        }        
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <Toaster />
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader> {ticket.status == 'resuelto' ? 'Cerrar ticket como resuelto' : 'Recoordinar Ticket'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={1} scrollBehavior={'outside'} >


                        {ticket.status == 'resuelto' &&
                            <FormControl mb={4}>
                                <FormLabel>Equipo (ONU, Router o CPE)</FormLabel>
                                <Controller
                                    control={control}
                                    name="stocks_id"
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <AsyncSelect
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            loadOptions={(value) => loadStockOptions(value)}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar ...'}
                                            isMulti
                                            noOptionsMessage={() => 'No hay equipos...'}
                                            onInputChange={(value) => handleStockInputChange(value)}
                                        />

                                    )}
                                />
                            </FormControl>}

                        {ticket.status == 'resuelto' &&
                            <FormControl isInvalid={errors.comment}>
                                <FormLabel>Comentario</FormLabel>
                                <Input placeholder='Escriba un resumen del st...' {...register('comment', { required: false })} />
                            </FormControl>
                        }

                        <FormControl mt={5}>
                            <FormLabel></FormLabel>
                            <Checkbox {...register('update_geocode')}>Actualizar geolocalización del cliente</Checkbox>
                        </FormControl>

                        {
                            updateGeocodeChecked &&
                            <Alert status='info' mb={5} mt={5} rounded={'md'}>
                                <AlertIcon />
                                <Text fontWeight={'bold'} fontSize={14}>
                                    Si va actualizar la geo del cliente, asegurese de encontrarse en la casa del cliente para poder actualizarla correctamente.
                                </Text>
                            </Alert>
                        }


                        {ticket.status == 'recoordinar' &&
                            <FormControl mt={5}>
                                <FormLabel>Razón para recoordinar</FormLabel>
                                <Controller
                                    control={control}
                                    name="reason"
                                    rules={{ required: true, }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={recoordinateOptions}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                        />

                                    )}
                                />
                            </FormControl>}

                        {ticket.status == 'resuelto' &&
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <Divider my={3} borderBottomWidth={2} borderBottomColor={'blackAlpha.600'} />

                                <Text fontWeight={'bold'} textAlign={'center'} mt={5} fontSize={17}>
                                    Tareas Realizadas
                                </Text>

                                <Alert status='info' my={4} rounded={'md'}>
                                    <AlertIcon />
                                    <Text fontWeight={'semibold'} fontSize={12}>
                                        Completar solo el formulario correspondiente a la tecnología instalada en el cliente.
                                    </Text>
                                </Alert>

                                <Accordion allowToggle w={'100%'}>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton >
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Formulario de Wireless
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <FormExecutedTasks control={control} customSelectStyles={customSelectStyles} setTasksForm={setTasksForm} tech={'W'} />
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Formulario de FTTH
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <FormExecutedTasks control={control} customSelectStyles={customSelectStyles} setTasksForm={setTasksForm} tech={'FO'} />
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>

                                <Button mt={8} mb={3} colorScheme='whatsapp' variant={'outline'} size='sm' isLoading={isLoading} onClick={verifyConnection}>
                                    Verificar conexión con Okam
                                </Button>

                                { okamVerify.verified ?
                                    <Alert status={okamVerify.status == 'unknown' ? 'warning' : okamVerify.status} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' my={5} rounded={'md'}>
                                        <AlertIcon boxSize='30px' mb={2} />
                                        <Text fontWeight={'semibold'} fontSize={14}>
                                            {okamVerify.message}
                                        </Text>
                                    </Alert>
                                    :
                                    <Alert py={1} rounded={'md'} mt={3}>
                                        <AlertIcon status={'info'} />
                                        <Text fontWeight={'semibold'} fontSize={12}>
                                            Antes de cerrar el ticket, debe verificar la conexión con Okam.
                                        </Text>
                                    </Alert>
                                }
                            </Box>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => onClose(false)} mr={3} isDisabled={button.disabled}>Cancelar</Button>
                        <Button colorScheme='blue' type="submit" isDisabled={button.disabled}>
                            {button.text}
                        </Button>
                    </ModalFooter>
                </form>

            </ModalContent>
        </Modal>
    )
}

const TicketInfo = ({ data, fetchNextTicket }) => {


    const [newsDescription, setNewsDescription] = useState(null)
    const [napearReadOnly, setNapearReadOnly] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenNews, onOpen: onOpenNews, onClose: onCloseNews } = useDisclosure();
    const { isOpen: isOpenInstallation, onOpen: onOpenInstallation, onClose: onCloseInstallation } = useDisclosure();
    const { isOpen: isOpenBajas, onOpen: onOpenBajas, onClose: onCloseBajas } = useDisclosure();

    const { customer, ticket_category, id, area, recurrent } = data;

    const backgroundColor = useColorModeValue('white', '#191d32');
    const borderColor = useColorModeValue('#E3EAF2', '#101219');

    const customer_keys = Object.keys(customer).filter(item => item.includes('phone') && customer[item] && customer[item] != '');
    const phones = customer_keys.map(item => customer[item]);

    const [connectionData, setConnectionData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [closeTicketButtonHide, setCloseTicketButtonHide] = useState(area != 'ST' && customerIsFTTH(data.customer) ? true : false);

    const handleTicketTypeInfo = () => {
        setNewsDescription(<Box><Text>En DO+, ahora hay un nuevo dato llamado <strong>'Tipo de ticket'</strong>, el cual puede ser <strong>ST</strong>, <strong>INSTALACIONES</strong> o <strong>BAJAS</strong>. </Text><Text fontSize={'12px'} mt={3}> * Si el ticket es de Instalaciones o Bajas y el cliente es FTTH, se requiere el SN y PRECINTO de la ONU.</Text></Box>);
        onOpenNews();
    }

    let infoTicket = [
        {
            label: (
                <Flex alignItems={'center'} gap={'0.6vh'}>
                    <Badge colorScheme="green" fontSize={'12px'} placeItems={'center'}></Badge>
                    <Text color='gray.400'>Tipo de ticket</Text>
                    <FaQuestionCircle cursor={'pointer'} color='#A0BBDE' onClick={handleTicketTypeInfo} />
                </Flex>
            ),
            component: <Badge colorScheme="blue" mt={2} fontSize={'12px'} placeItems={'center'}>{area}</Badge>,
            isNew: true
        },
        {
            label: 'Ticket',
            text: `#${id}`,
            isNew: false
        },
        {
            label: 'Horario de visita',
            component: <VisitingHourBadge visiting_hours={data.visiting_hours} />,
            isNew: false
        },
        {
            label: 'Plan',
            text: customer.plan,
            isNew: false
        },
        {
            label: 'Dirección',
            text: customer.address,
            link: `https://www.google.com.ar/maps/dir//${customer.geocode.latitude},${customer.geocode.longitude}`,
            isNew: false
        },
        {
            label: 'Categoría de Ticket',
            text: ticket_category,
            isNew: false
        },
        {
            label: 'Teléfonos',
            text: phones.map((phone, index) => <Link key={index} color={'#319795'} mb={1} textDecoration={'underline'} href={`tel:${phone}`}>{index !== 0 && <br></br>}{phone}</Link>),
            isNew: false
        }
    ];

    if (recurrent != null && recurrent >= 1){
        infoTicket.unshift({
            //label: 'Cliente Reiterado',
            component: <Badge colorScheme="red">Cliente Reiterado ({recurrent} tickets)</Badge>
        })
    }

    const [customerData, setCustomerData] = useState(infoTicket);

    const searchConnectionData = () => {
        setLoading(true);

        axios.get(`/api/technician/customerConnectionData?customer_code=${data.customer.code}`)
            .then(res => {
                const { data } = res;

                setConnectionData(data.connection_info);
            })
            .catch(err => {
                toastError('Error al buscar datos de conexión');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function handleAfterInstallationSuccess () {
        const napear = localStorage.getItem('napear');

        if (napear && area === 'INSTALACIONES' && customerIsFTTH(data.customer)) {
            const { success } = JSON.parse(napear);

            if (success) {
                setCloseTicketButtonHide(false);

                // agrego un nuevo item al array de customerData
                setCustomerData(prevState => {
                    return [
                        ...prevState,
                        {
                            label: null,
                            component: <Box
                                display="flex"
                                alignItems="center"
                                backgroundColor="#F2FAF3"
                                border="1px solid #CDE1D3"
                                borderRadius="20px"
                                p={2}
                                cursor={'pointer'}
                                onClick={() => handleReadOnlyNapearData()}
                            >
                                <FaCheckCircle color="#00914F" size={16} />
                                <Text ml={2} fontSize="14px" fontWeight={'medium'}>
                                    Datos de instalación cargados
                                </Text>
                            </Box>
                        }
                    ]
                }
                );


            }
        }
    }

    function handleNapearModalBajasOnClose (success = false) {
        onCloseBajas();
        if (success) {
            toastSuccess('Equipos retirados correctamente');
        }
    }


    function handleNapearModalInstalacionesOnClose (success = false) {
        onCloseInstallation();


        if (success) {
            toastSuccess('ONU instalada correctamente');
            handleAfterInstallationSuccess();
        }
    }

    function handleReadOnlyNapearData () {
        setNapearReadOnly(true);
        onOpenInstallation();
    }




    // useEffect para mostrar (o no) la informacion referente al tipo de Ticket. Esto eventualmente se tiene que quitar
    useEffect(() => {

        //TODO eliminar luego de la fecha
        if (datetimeDiff(currentDatetime(), startOfDate('2023-06-26')) < 10) {
            if (localStorage.getItem('ticketTypeInfo') === 'true') return;

            const timeout = setTimeout(() => {
                localStorage.setItem('ticketTypeInfo', true);
                handleTicketTypeInfo();
            }, 2000);

            return () => clearTimeout(timeout);

        }

    }, []);

    useEffect(() => {
        handleAfterInstallationSuccess();
    }, []);




    function redirectMaps (link) {
        window.open(link, '_blank');
    }

    function buttonAction (ticket_status) {
        data.status = ticket_status;

        onOpen();
    }

    function handleOnClose (getNextTicket = false) {

        onClose();

        if (getNextTicket) {
            fetchNextTicket();
        }

    }

    const handleSuccessOnuUp = (success = false) => {

        if (success) {
            handleAfterInstallationSuccess();
        }
    }


    return (
        <>
            <Box mt={10} backgroundColor={backgroundColor} borderRadius={10} border={`1px solid ${borderColor} `} p={5} mb={10}>
                <Heading size={'md'} mb={5}>
                    {`${customer.code} - ${customer.name.toUpperCase()} ${customer.lastname.toUpperCase()}`}
                </Heading>
                <Divider />
                <VStack
                    divider={<StackDivider borderColor='gray.200' />}
                    spacing={5}
                >

                    {
                        customerData.map((item, index) =>
                            <Box key={index} alignContent={'center'} mt={index == 0 ? 4 : 0}>


                                {item.label && typeof item.label !== 'object' ?
                                    <Text color='gray.400'>{item.label}</Text>
                                    :
                                    item.label
                                }

                                {
                                    item.link
                                        ?
                                        <Link color='teal.500' onClick={() => redirectMaps(item.link)} >
                                            {item.text}
                                        </Link>
                                        :
                                        item.component ? item.component :
                                            <Text>{item.text}</Text>
                                }

                            </Box>
                        )
                    }
                    <Box alignContent={'center'}>
                        <Text color='gray.400'>Datos de conexión</Text>

                        {connectionData &&
                            (connectionData.username ?
                                <Box mt={2}>
                                    <HStack><Text fontWeight={'semibold'}>IP: </Text><Text>{connectionData.ip}</Text></HStack>
                                    <HStack><Text fontWeight={'semibold'}>Contraseña: </Text><Text>{connectionData.password}</Text></HStack>
                                    <HStack><Text fontWeight={'semibold'}>Usuario: </Text><Text>{connectionData.username}</Text></HStack>
                                </Box>
                                :
                                <Box mt={2}>
                                    <HStack><Text fontWeight={'semibold'}>IP: </Text><Text>{connectionData.ip}</Text></HStack>
                                    <HStack><Text fontWeight={'semibold'}>Contraseña: </Text><Text>{connectionData.cpe_password}</Text></HStack>
                                </Box>
                            )
                        }

                        <Button mt={3} colorScheme="blue" size={'sm'} onClick={searchConnectionData} isLoading={loading}>{connectionData ? 'Actualizar' : 'Buscar'}</Button>
                    </Box>
                </VStack>
                <Divider mt={4} mb={8} />

                {
                    area == 'INSTALACIONES' && closeTicketButtonHide &&
                    <Button
                        colorScheme='blue'
                        w={'100%'}
                        variant='solid'
                        fontSize={{ base: '14px', md: '15px', lg: '16px' }}
                        onClick={() => onOpenInstallation()}
                    >
                        Cargar datos de instalación
                    </Button>
                }

                {
                    area == 'BAJAS' && closeTicketButtonHide &&
                    <Button
                        colorScheme='blue'
                        w={'100%'}
                        variant='solid'
                        fontSize={{ base: '14px', md: '15px', lg: '16px' }}
                        onClick={() => onOpenBajas()}
                    >
                        Retiro de equipos
                    </Button>
                }

                {
                    !closeTicketButtonHide &&
                    <Button
                        colorScheme='green'
                        w={'100%'}
                        variant='solid'
                        onClick={() => buttonAction('resuelto')}
                        fontSize={{ base: '14px', md: '15px', lg: '16px' }}>
                        Cerrar ticket como resuelto
                    </Button>
                }

                <Button
                    mt={5}
                    colorScheme='gray'
                    variant='link'
                    w={'100%'}
                    onClick={() => buttonAction('recoordinar')}
                    fontWeight={'normal'}
                    fontSize={{ base: '14px', md: '15px', lg: '16px' }}>
                    Recoordinar visita
                </Button>
            </Box>

            {
                ['ST','BAJAS'].includes(area) && <ModalCierreTicketSt ticket={data} onClose={(getNextTicket) => handleOnClose(getNextTicket)} isOpen={isOpen} />
            }

            {
                ['INSTALACIONES'].includes(area) && !closeTicketButtonHide &&
                <CustomModal
                    icon={<AiOutlineInfoCircle color="#3B81F5" />}
                    colorIcon="#EEF6FF"
                    title='Recoordinar ticket'
                    description="Completa el formulario para recoordinar el ticket."
                    bodyContent={<MyForm ticket_id={id} mesa_username={globalUser.mesa_username} />}
                    onClose={() => handleOnClose()}
                    isOpen={isOpen}
                />
            }

            <ModalInfo onClose={onCloseNews} isOpen={isOpenNews} newsDescription={newsDescription} />

            <NapearModalInstalaciones handleSuccess={handleSuccessOnuUp} onClose={(success) => handleNapearModalInstalacionesOnClose(success)} isOpen={isOpenInstallation} ticketId={data.id} readOnly={napearReadOnly} />

            <NapearModalBajas onClose={(success) => handleNapearModalBajasOnClose(success)} isOpen={isOpenBajas} readOnly={napearReadOnly} codigoCliente={data.customer.code} />

        </>
    )
}

const ClientInfo = ({ data, isOpen, onClose }) => {

    const { customer, ticket_category, id, visiting_hours, recurrent } = data;

    const customer_keys = Object.keys(customer).filter(item => item.includes('phone') && customer[item] && customer[item] != '');
    const phones = customer_keys.map(item => customer[item]);

    function redirectMaps (link) {
        window.open(link, '_blank');
    }

    const customerData = [
        {
            label: 'Horario de visita',
            component: <VisitingHourBadge visiting_hours={visiting_hours} />,
        },
        {
            label: 'Dirección',
            text: customer.address,
            link: `https://www.google.com.ar/maps/dir//${customer.geocode.latitude},${customer.geocode.longitude}`
        },
        {
            label: 'Categoría de Ticket',
            text: ticket_category
        },
        {
            label: 'Teléfonos',
            text: phones.join(', ')
        }
    ];

    if (recurrent != null && recurrent >= 1){
        customerData.unshift({
            //label: 'Cliente Reiterado',
            component: <Badge colorScheme="red">Cliente Reiterado ({recurrent} tickets)</Badge>
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{`${customer.code} - ${customer.name.toUpperCase()} ${customer.lastname.toUpperCase()}`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <VStack
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={5}
                        align='center'
                    >
                        {
                            customerData.map((item, index) =>
                                <Box key={index} mt={index == 0 ? 4 : 0} textAlign={'center'}>
                                    <Text color='gray.400' fontSize={17}>{item.label}</Text>
                                    {
                                        item.link ?
                                            <Link color='teal.500' fontSize={16} onClick={() => redirectMaps(item.link)} >
                                                {item.text}
                                            </Link>
                                            :
                                            item.component ?
                                                item.component
                                                :
                                                <Text fontSize={16}>{item.text}</Text>
                                    }
                                </Box>
                            )
                        }
                    </VStack>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

/**
 * Modal que uso solo a nivel informativo (mostrar descripcion de una nueva funcionalidad por ejemplo)
 */
const ModalInfo = ({ onClose, isOpen, newsDescription }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg='#FFFFFF80' backdropFilter='auto' backdropBlur='3px' />
            <ModalContent backgroundColor="#3466FF" sx={{ ".chakra-modal__close-btn": { display: 'none' } }}>
                <ModalHeader color={'white'} >Tipo de ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody color={'white'}>
                    {newsDescription}
                </ModalBody>

                <ModalFooter>
                    <Button backgroundColor="white" color={'#3466FF'} mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const ObservationForm = ({ onClose, ticket }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {

        ticket.status = 'resuelto';
        ticket.comment = data.observations;

        if (ticket.area == 'INSTALACIONES') {

            data = {
                ticket_id: ticket.id,
                issue: 'INSTALACION_FINALIZADA',
                comment: data.observations,
                sn: JSON.parse(localStorage.getItem('napear')).onu,
                precinto: JSON.parse(localStorage.getItem('napear')).precinto,
                mesa_username: JSON.parse(localStorage.getItem('user')).mesa_username,
            }

            try {

                await axios.put(`/api/ticket/installation`, data);


            } catch (error) {

                toastError('Ocurrió un error al intentar cerrar el ticket');

                return false;
            }
        }

        data = ticket;

        await axios.post('/api/technician/updateTicket', ticket)
            .then(res => {
                onClose(true);
            })
            .catch(err => {
                toastError('Error al actualizar el ticket');
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={5}>

                <FormControl isInvalid={errors.observations} mb={4}>
                    <FormLabel color={'#3E3D3D'}>Observaciones</FormLabel>
                    <Textarea {...register('observations', { required: false })} maxH={'200px'} fontSize={'14px'} />
                    <FormErrorMessage>{errors.observations && 'Campo requerido'}</FormErrorMessage>
                </FormControl>

                <Flex flexDir={'row'} gap={2} width={'100%'} >
                    <Button onClick={() => onClose()} type="button" width={'100%'} fontWeight={'medium'} fontSize={'14px'} color={'#868383'} border={'1px solid #D7D5D5'} _hover={{ bg: '#EEEEEE' }} bg={'transparent'} rounded={'xl'}>
                        Cancelar
                    </Button>

                    <Button type="submit" width={'100%'} fontWeight={'medium'} fontSize={'14px'} color={'white'} _hover={{ bg: '#085AFF' }} bg={'#0568FF'} rounded={'xl'}>
                        Cerrar ticket
                    </Button>
                </Flex>
            </Box>
        </form>
    );
};



export default function Index () {
    const { mutate } = useSWRConfig();

    const [user, setUser] = useState();
    const [fetchNextTicket, setFetchNextTicket] = useState();
    const [showTicket, setShowTicket] = useState(false);
    const [lastTicket, setLastTicket] = useState(false);
    const [distanceAlert, setDistanceAlert] = useState({
        status: false,
        message: null
    });

    const { data, isLoading } = useSWR(user ? `/api/technician/ticketToDo?technician_id=${user.id}` : null, fetcher);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDistanceAlertOpen, onOpen: onDistanceAlertOpen, onClose: onDistanceAlertClose } = useDisclosure();


    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
        globalUser = JSON.parse(localStorage.getItem('user'));
    }, [])

    async function handleShowTicket (ticket) {
        const { id, team_id, cluster_id } = ticket;

        axios.put(`/api/technician/updateTicket`, {
            ticket_id: id,
            status: 'en curso',
            lastTicket: lastTicket,
            team_id: team_id,
            cluster_id: cluster_id
        })

        setShowTicket(!showTicket)
        setDistanceAlert({ status: false, message: null });

    }

    async function handleLocation (ticket) {
        // Verificar distancia entre la geo del ticket y la del tecnico
        const { geocode } = ticket.customer;

        if (geocode.latitude && geocode.longitude) {
            let distancia;

            try {
                distancia = await calculateDistance(geocode.latitude, geocode.longitude);

            } catch (error) {
                distancia = null;

                return false;
            }

            if (distancia > 50 || !distancia) {
                setDistanceAlert({ status: true, message: distancia ? 'El cliente se encuentra a más de 50 metros de su ubicación actual.' : 'No se pudo obtener su ubicación actual.' });
            }
            else {
                handleShowTicket(ticket);
                setDistanceAlert({ status: false, message: null });
            }
        }
    }

    useEffect(() => {
        if (data?.tickets?.length == 1) {
            setLastTicket(true);
        }
        else {
            setLastTicket(false);
        }
    }, [data])

    useEffect(() => {
        mutate(user ? `/api/technician/ticketToDo?technician_id=${user.id}` : null);
        setShowTicket(false);
    }, [fetchNextTicket])

    useEffect(() => {
        if (distanceAlert.status) {
            onDistanceAlertOpen();
        }
    }, [distanceAlert])

    return (
        <Container px={3} mt={10} textAlign={'center'} >
            <Toaster />
            {
                isLoading && <p>Cargando tickets...</p>
            }
            {
                data && !isLoading && !data.error && !showTicket && !data?.tickets.some(item => item.ticket_status == 'EN_CURSO') && data?.tickets.length > 0 &&
                <>
                    <Alert
                        status='info'
                        variant='subtle'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        textAlign='center'
                        borderRadius={3}
                    >
                        <AlertIcon boxSize='40px' mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize='lg'>
                            Hay un nuevo ticket para hacer
                        </AlertTitle>
                        <Button
                            w={'100%'}
                            borderRadius={3}
                            mt={5}
                            leftIcon={<AiOutlineEye size={20} />}
                            colorScheme={'blue'}
                            fontWeight={'normal'}
                            onClick={() => onOpen()}
                        >
                            Mostrar Ubicación de Cliente
                        </Button>

                        <AlertDescription mt={4} fontSize={15}>Asegúrese de estar en el cliente antes de dar a "Comenzar Ticket".</AlertDescription>

                        <Button
                            w={'100%'}
                            borderRadius={3}
                            mt={5}
                            leftIcon={<SlRocket size={17} />}
                            colorScheme={'green'}
                            fontWeight={'normal'}
                            onClick={() => handleLocation(data.tickets[0])}
                        >
                            Comenzar Ticket
                        </Button>

                        <Modal isOpen={isDistanceAlertOpen} onClose={onDistanceAlertClose} isCentered>
                            <ModalOverlay />
                            <ModalContent >
                                <ModalHeader >Alerta de distancia</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text fontSize={16} fontWeight={'medium'} mt={5}>{distanceAlert.message}</Text>
                                    <Text fontSize={16} fontWeight={'medium'} textAlign={'center'} my={5}>¿Desea continuar?</Text>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme="orange" mr={3} onClick={() => handleShowTicket(data.tickets[0])}>
                                        Continuar
                                    </Button>
                                    <Button variant="ghost" onClick={onDistanceAlertClose}>
                                        Cancelar
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Alert>
                </>

            }
            {
                data && !isLoading && !data.error && !data?.tickets?.length == 0 &&
                <ClientInfo data={data.tickets[0]} isOpen={isOpen} onClose={onClose} />

            }
            {
                data && !isLoading && !data.error && (showTicket || data?.tickets.some(item => item.ticket_status == 'EN_CURSO')) &&
                <TicketInfo data={data.tickets[0]} fetchNextTicket={() => setFetchNextTicket(new Date())} />

            }
            {
                data && !isLoading && data?.tickets?.length == 0 && <>
                    <Image src='/images/dog.png' alt='Dog' />
                    <Text fontWeight={'bold'}>No hay tickets para hacer, por ahora...</Text>
                </>
            }
            {
                !isLoading && !data?.tickets && data?.error &&
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>{data?.response?.message || 'Ha ocurrido un error inesperado.'}</AlertTitle>
                </Alert>
            }
        </Container>

    )


}