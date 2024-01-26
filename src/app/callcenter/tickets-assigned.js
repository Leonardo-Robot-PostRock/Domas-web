import { Container, Box, Badge, Text, Select, Flex, Icon } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useToast, useDisclosure } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import Table from '@/components/Datatable/Table.js';
import fetcher from "@/utils/Fetcher";
import useSWR, { mutate } from "swr";
import dayjs from "dayjs";
import Link from 'next/link';
import axios from 'axios';
import { MassiveUpdate } from '@/components/Ticket';
import { IoInformationCircleOutline } from "react-icons/io5";

let selectedRows = [];

const Index = () => {
    const [user, setUser] = useState(null);
    const [workers, setWorkers] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [allowMassiveUpdate, setAllowMassiveUpdate] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'));

        if (userInfo) {
            userInfo.roles = userInfo.roles.map(item => item.name);
            setUser(userInfo);

            if (userInfo.roles.includes('SUPERVISOR') || userInfo.roles.includes('ADMINISTRADOR')) {
                setAllowMassiveUpdate(true);
                axios.get('/api/mesa/callcenter/getworkers')
                    .then(response => {
                        //console.log(response.data);
                        setWorkers(response.data);
                    })
                    .catch(error => {
                        //console.log(error);
                        toast({
                            title: 'Error',
                            description: 'Ocurrio un error al obtener los operarios',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    });
            }
        }
    }, []);

    return (
        <Container maxW={{ base: '100%', md: '90%' }} 
            p={{base: 2, md: 5}} mt={4}>
            <Tabs isLazy variant='unstyled'>
                <TabList px={4}>
                    <Tab bg={'white'} color={'black'} rounded={'full'} mr={2}
                        _selected={{ color: 'white', bg: 'blue.500' }}>Asignados a CCT</Tab>
                    <Tab bg={'white'} color={'black'} rounded={'full'} mr={2}
                        _selected={{ color: 'white', bg: 'blue.500' }}>Asignados a usuario</Tab>
                    { workers && workers.length > 0 ?
                        <Tab bg={'white'} color={'black'} rounded={'full'}
                            _selected={{ color: 'white', bg: 'blue.500' }}>Operarios</Tab>
                        :
                        null
                    }
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <UserTickets user={'callcenter'} massiveUpdate={allowMassiveUpdate} />
                    </TabPanel>

                    <TabPanel>
                        { (user && user.mesa_username) ?
                            <UserTickets user={user.mesa_username} massiveUpdate={allowMassiveUpdate} />
                            :
                            <Text>El usuario debe tener un usuario de Mesa para ver sus tickets</Text>
                        }
                    </TabPanel>

                    <TabPanel>
                        { workers && workers.length > 0 ?
                            <>
                                <Box p={4} bg={'white'} mb={4} rounded={'md'} shadow={'md'}>
                                    <Select onChange={(e) => setSelectedWorker(e.target.value)} w={{ base: '100%', md: '30%' }} mx={'auto'}>
                                        <option value="">Seleccione un operario</option>
                                        {workers.map((worker, index) => (
                                            <option key={index} value={worker.mesa_username}>{worker.name}</option>
                                        ))}
                                        <option value="all">Todos</option>
                                    </Select>                                                               
                                </Box>

                                { selectedWorker &&
                                    <UserTickets user={selectedWorker} massiveUpdate={true} />
                                }     
                            </>
                            :
                            <Text>No hay operarios disponibles</Text>
                        }
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}

const UserTickets = ({ user, massiveUpdate }) => {
    const [clearSelectedRows, setClearSelectedRows] = useState(false);

    let { data, error } = useSWR(`/api/mesa/callcenter/getTickets?username=${user}`, fetcher);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const toastIdRef = useRef();


    const handleRowSelected = (state) => {
        selectedRows = state.selectedRows;

        if (state.selectedRows.length > 0) {
            if (!toastIdRef.current) {
                toastIdRef.current = toast({
                    duration: null,
                    position: 'bottom',
                    render: () => (
                        <Flex mb={16} w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}
                                bg={'purple.500'} p={3} borderRadius={10} color={'white'} cursor={'pointer'}
                                _hover={{ backgroundColor: 'purple.600' }}
                                style={{ transition: 'all .2s', boxShadow: '4px 4px 5px 0px rgba(0, 0, 0, 0.24)' }}
                                onClick={() => handleMassiveUpdateTickets()}>
                                <Icon as={IoInformationCircleOutline} boxSize={6} mr={3} />
                                {`Actualizar ${selectedRows.length} tickets`}
                            </Box>
                        </Flex>
                    )
                });
            }
            else {
                toast.update(toastIdRef.current, {
                    duration: null,
                    position: 'bottom',
                    render: () => (
                        <Flex mb={16} w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}
                                bg={'purple.500'} p={3} borderRadius={10} color={'white'} cursor={'pointer'}
                                _hover={{ backgroundColor: 'purple.600' }}
                                style={{ transition: 'all .2s', boxShadow: '4px 4px 5px 0px rgba(0, 0, 0, 0.24)' }}
                                onClick={() => handleMassiveUpdateTickets()}>
                                <Icon as={IoInformationCircleOutline} boxSize={6} mr={3} />
                                {`Actualizar ${selectedRows.length} tickets`}
                            </Box>
                        </Flex>
                    )
                });
            }
        }
        else {
            toast.close(toastIdRef.current);
            toastIdRef.current = null;
            selectedRows = [];
        }
    }

    const handleMassiveUpdateTickets = () => {
        toast.close(toastIdRef.current);
    
        onOpen();
    }

    const handleOnMassiveUpdateCloseModal = () => {
        toast.close(toastIdRef.current);
        toastIdRef.current = null;
        onClose();
    }

    const handleClearSelectedRows = (value) => {
        toast.close(toastIdRef.current);
        toastIdRef.current = null;
        setClearSelectedRows(value);

        mutate(`/api/mesa/callcenter/getTickets?username=${user}`);
    }
    
    const columns = [
        {
            name: 'Ticket ID',
            selector: row => row.id,
            cell: row => (
                <Link href={`/mesa/ticket/${row.id}`}>
                    <Text decoration={'underline'} cursor={'pointer'} >{row.id}</Text>
                </Link>
            ),
            sortable: true,
            compact: true
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            cell: row => (
                <Badge
                    colorScheme={row.estado == 'nuevo' ? 'red' : row.estado.includes('en curso') ? 'orange' : 'blue'}
                >
                    {row.estado}
                </Badge>
            ),
            sortable: true
        },
        {
            name: 'Categoria',
            selector: row => row.categoria,
            sortable: true,
            grow: 2
        },
        {
            name: 'N° Cliente',
            selector: row => row.codigo_cliente,
            sortable: true
        },
        {
            name: 'Alta',
            selector: row => dayjs(row.fecha_alta).format('DD/MM/YYYY HH:mm'),
            sortable: true
        },
        {
            name: 'Actualizado',
            selector: row => dayjs(row.fecha_actualizacion).format('DD/MM/YYYY HH:mm'),
            sortable: true
        },
        {
            name: 'Asignado',
            selector: row => row.asignado,
            sortable: true
        }
    ]

    return (
        <Box>
            <Table 
                columns={columns} 
                data={data} 
                title={'Tickets'} 
                containerWidth={'100vw'} 
                selectable={massiveUpdate}
                handleRowSelected={(state) => handleRowSelected(state)}
                clearSelectedRows={clearSelectedRows}
            />
            <MassiveUpdate isOpen={isOpen} onClose={() => handleOnMassiveUpdateCloseModal()} clearSelectedRows={(value) => handleClearSelectedRows(value)} tickets={selectedRows} />
        </Box>
    )    
}

export default Index;