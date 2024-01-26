import { Container, Box, Flex, Button, Badge, Text, FormControl, FormLabel, Tooltip, Divider, Icon, IconButton, Input, InputLeftAddon, InputGroup, Checkbox, Radio, RadioGroup, Spinner  } from '@chakra-ui/react';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import dayjs from "dayjs";
import { toastError, toastSuccess } from "@/components/Toast.js";
import { Toaster } from "react-hot-toast";
import { NewTicket, ChangeGeoModal } from '@/components/Ticket';
import { MdFiberManualRecord, MdWifiPassword, MdEdit, MdOutlineAddCircleOutline } from "react-icons/md";
import { FiCheck, FiX, FiHelpCircle, FiMapPin } from "react-icons/fi";
import Link from 'next/link';
import Table from '@/components/Datatable/Table';


const Index = () => {
    const [user, setUser] = useState(null);
    const [searchType, setSearchType] = useState('code');
    const [input, setInput] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [tickets, setTickets] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pingCustomer, setPingCustomer] = useState(false);
    const [pingAp, setPingAp] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenGeo, onOpen: onOpenGeo, onClose: onCloseGeo } = useDisclosure();

    const handleSearch = async () => {

        if(!input) return;
        else if(searchType == 'dni' && input.length < 7) return toastError('DNI Invalido');

        setLoading(true);
        setError(null);
        setCustomer(null);
        setTickets(null);
        setPingCustomer(false);
        setPingAp(false);

        await axios.get(`/api/mesa/searchCustomer?${searchType}=${input}`)
            .then(res => {
                //console.log(res.data);
                setCustomer(res.data.customer);
                setTickets(res.data.tickets);
            })
            .catch(error => {
                //console.log(error);
                let message = error.response?.data?.message ?? 'Error al buscar el cliente.';
                toastError(message);
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
        const userInfo = JSON.parse(localStorage.getItem('user'));

        if (userInfo) {
            userInfo.roles = userInfo.roles.map(item => item.name);
            setUser(userInfo);
        }

    }, []);

    return (
        <Container maxW={{ base: '100%', md: '90%' }} backgroundColor={'white'}
            borderRadius={10} border={`1px solid #E3EAF2`} p={{base: 2, md: 5}} mt={10}>
            <Toaster />
            <Text textAlign={'center'} fontWeight={'bold'} fontSize={'3xl'} mt={4} mb={4} color={'#319DA0'} > BUSCAR CLIENTE </Text>
            <Divider mb={5} mt={5} />

            <Flex direction={'column'} mb={5} alignItems={'center'} justifyContent={'center'} gap={5} >
                <FormControl display={'flex'} flexDirection={'row'} w={'fit-content'} >
                    <FormLabel >Buscar por</FormLabel>
                    <RadioGroup defaultValue={'code'} onChange={(e) => setSearchType(e)}>
                        <Radio mr={5} value={'code'}>Codigo de cliente</Radio>
                        <Radio value={'dni'}>DNI</Radio>
                    </RadioGroup>
                </FormControl>

                <Flex direction={'row'} wrap={'wrap'} mb={5} alignItems={'center'} justifyContent={'center'} gap={5} >                
                    <FormControl id="customer" isRequired w={{base: '85%', md: '60%'}} >
                        <InputGroup>
                            <InputLeftAddon children='Cliente' />
                            <Input type="text" placeholder="564024" onChange={(e) => setInput(e.target.value)} />
                        </InputGroup>
                    </FormControl>
                    <Button colorScheme="teal" size="md" isLoading={loading} loadingText='Cargando...' onClick={handleSearch} >Buscar</Button>
                </Flex>
            </Flex>           

            <Divider mb={5} mt={5} />

            { customer &&
                <Box w={'100%'} mt={8} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} gap={7}>
                    <CustomerData customer={customer} pingCustomer={pingCustomer} pingAp={pingAp} />
                    <Box w={'100%'} display={'flex'} flexDirection={'row'} p={4} gap={6} justifyContent={'center'}>
                        <Button w={{base: '40%', md: '20%'}} size={'md'} colorScheme={'teal'} onClick={onOpen} isLoading={loading} alignSelf={'center'} leftIcon={<MdOutlineAddCircleOutline />}>Crear Ticket</Button>
                        { user && (user.roles.includes('SUPERVISOR') || user.roles.includes('ADMINISTRADOR')) &&
                            <Button w={{base: '40%', md: '20%'}} size={'md'} colorScheme={'teal'} onClick={onOpenGeo} isLoading={loading} alignSelf={'center'} leftIcon={<MdEdit />}>Editar Geo</Button>
                        }
                    </Box>
                    <NewTicket isOpen={isOpen} onClose={onClose} customer={customer} />
                    <ChangeGeoModal isOpen={isOpenGeo} onClose={onCloseGeo} customer={customer} />
                </Box>                
            }
            { tickets &&            
                <Tabs variant='enclosed' isLazy mt={5}>
                    <TabList>
                        <Tab w={{base: '50%', md: '15%'}} _selected={{ color: 'white', bg: '#4080bf' }}>Tickets</Tab>
                        <Tab w={{base: '50%', md: '15%'}} _selected={{ color: 'white', bg: '#4080bf' }}>Análisis</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            { error? 
                                <Alert status='error'>
                                    <AlertIcon />
                                    {error}
                                </Alert>
                                :
                                <TableTickets tickets={tickets} />
                            }
                        </TabPanel>
                        
                        <TabPanel >
                            { customer &&
                                <AnalysisGraph customer={customer} />
                            }
                            
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            }
        </Container>
    )
}

const CustomerData = ({ customer, pingCustomer, pingAp }) => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const { onOpen: onOpenPassword, onClose: onClosePassword, isOpen: isOpenPassword } = useDisclosure();

    const hasGeo = customer?.geocode?.latitude? true : false;

    const getCpeKey = () => {
        setLoading(true);
        axios.get(`/api/utility/cpe-password?ip=${customer.connection.ip}`)
        .then(res => {
            setPassword(res.data.password);
        })
        .catch(err => {
            //console.log(err);
            toastError('Error al obtener la clave del CPE');
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <Box display={'flex'} flexDirection={{base: 'column', md: 'row'}} gap={5} justifyContent={'center'}>
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
                <Text><strong>Documento:</strong> {customer.dni}</Text>
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
                                    isOpen={isOpenPassword}
                                    onOpen={onOpenPassword}
                                    onClose={onClosePassword}
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
                                            <Text>Clave: {password}</Text>
                                            <Button w={'40%'} size={'sm'} colorScheme={'blue'} onClick={getCpeKey} isLoading={loading} alignSelf={'center'}>Buscar</Button>
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
        </Box>
    )
}

const TableTickets = ({ tickets }) => {

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            cell: row => (
                <Link href={`/mesa/ticket/${row.id}`}>
                    <Text decoration={'underline'} cursor={'pointer'} >{row.id}</Text>
                </Link>
            ),
            sortable: true,
            compact: true,
        },
        {
            name: 'Alta',
            selector: row => dayjs(row.fecha_alta).unix(),
            cell: row => (
                <Text>{dayjs(row.fecha_alta).format('DD/MM/YYYY HH:mm')}</Text>
            ),
            sortable: true
        },
        {
            name: 'Actualizado',
            selector: row => dayjs(row.fecha_actualizacion).unix(),
            cell: row => (
                <Text>{dayjs(row.fecha_actualizacion).format('DD/MM/YYYY HH:mm')}</Text>
            ),
            sortable: true
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            cell: row => (
                <Badge colorScheme={row.estado == 'nuevo' ? 'red' : row.estado.includes('en curso') ? 'orange' : row.estado == 'en espera' ? 'blue' : row.estado.includes('no resuelto') ? 'purple' : 'green'}>
                    {row.estado}
                </Badge>
            ),
            sortable: true
        },
        {
            name: 'Categoria',
            selector: row => row.categoria,
            sortable: true,
        },        
        {
            name: 'En Do+',
            selector: row => row.dumas,
            cell: row => (
                <IconButton aria-label={'on dumas'} rounded={'full'} size={'xs'} colorScheme={row.dumas ? 'green' : 'red'} icon={row.dumas ? <FiCheck /> : <FiX />} />
            ),
            sortable: true,
            compact: true
        }
    ]

    return (
        <Box mt={3}>
            <Table 
                columns={columns} 
                data={tickets} 
                containerWidth={'100vw'}   
                container='simple'              
            />
        </Box>
    )
}

const AnalysisGraph = ({customer}) => {
    const [fromTime, setFromTime] = useState(dayjs().subtract(2, 'day').valueOf());
    const [toTime, setToTime] = useState(dayjs().valueOf());

    const serverRoute = process.env.APP_ENV.toUpperCase() == 'PROD' ? 'https://dumas.westnet.com.ar/grafana' : 'http://172.16.210.65:3000';

    return (
        <Box w={'100%'} display={'flex'} flexFlow={'column nowrap'} justifyContent={'center'} alignItems={'center'} gap={7}>
            { customer.connection.technology == 'FTTH' &&
                <Alert status='info'>
                    <AlertIcon />
                    Algunas OLT no tienen compatibilidad con el sistema por lo que no se mostrarán las gráficas.
                </Alert>
            }
            <Box w={'100%'} mt={3} display={'flex'} flexFlow={'row wrap'} justifyContent={'center'} alignItems={'center'} gap={{base: 5, md: 7}}>
                <Box>
                    <Text>Desde</Text>
                    <Input type={'date'} value={dayjs(fromTime).format('YYYY-MM-DD')} onChange={e => setFromTime(dayjs(e.target.value).valueOf())} />
                </Box>
                <Box>
                    <Text>Hasta</Text>
                    <Input type={'date'} value={dayjs(toTime).format('YYYY-MM-DD')} onChange={e => setToTime(dayjs(e.target.value).valueOf())} />
                </Box>
            </Box>
            <Box w={'100%'} display={'flex'} flexFlow={'row wrap'} justifyContent={'center'} alignItems={'center'} gap={7}>
                { customer.connection.technology == 'Wireless' ?
                    <>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Señal CPE</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=58`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=58`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Señal AP</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=56`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=56`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Descarga</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=32`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=32`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Airtime</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=34`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=34`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Capacidad (downlink)</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=36`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=36`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Capacidad (uplink)</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=48`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=48`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Velocidad Link Eth0</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=66`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=66`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Latencia (uplink)</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=70`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/j8heeZe4k/dash-clientes-wireless?orgId=2&var-cliente=${customer.code}&var-ip=${customer.connection.ip}&var-ap=${customer.connection.ssid}&from=${fromTime}&to=${toTime}&panelId=70`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                    </>
                    :
                    <>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Estado (línea de tiempo)</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=20`} width="550" height="300" frameborder="0"></iframe>                                
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=20`} width="100%" height="250" frameborder="0"></iframe>                                
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Descarga</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=2`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=2`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>Señal ONU</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=14`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=14`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                        <Box w={{base: '100%', md: 'auto'}}>
                            <Text textAlign={'center'} mb={2} fontWeight={'medium'}>NAP</Text>
                            <Box display={{base: 'none', md: 'block'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=27`} width="550" height="300" frameborder="0"></iframe>
                            </Box>
                            <Box display={{base: 'block', md: 'none'}}>
                                <iframe src={`${serverRoute}/d-solo/nLVnJh24k/dashboard-clientes-ftth?orgId=2&from=${fromTime}&to=${toTime}&var-cliente=${customer.code}+&var-ip=${customer.connection.ip}&panelId=27`} width="100%" height="250" frameborder="0"></iframe>
                            </Box>
                        </Box>
                    </>
                }
            </Box>
        </Box>
    )
}

export default Index;