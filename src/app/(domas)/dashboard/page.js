import {
    FormControl,
    FormLabel,
    Input, Button, Stack, Container, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useDisclosure, Skeleton, Box
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { use, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr'
import fetcher from "@/utils/Fetcher";
import BoatError from "@/components/Errors/Boat";
import axios from "axios";
import { toastError } from "@/components/Toast";
import { FiTool } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import ChartCloseTk from "@/components/Charts/TkSTCerrados";
import ChartReiterados from "@/components/Charts/ClientesReiterados";
import ChartInstalaciones from "@/components/Charts/TkInstalaciones";
import ChartCoordinationsByWorker from "@/components/Charts/CoordinationsByWorker";
import ChartProblemasFrecuentes from "@/components/Charts/ServiceLogs";
import ClustersStatus from "@/components/Charts/ClustersStatus";
import ChartOkam from "@/components/Charts/Okam";
import ChartZabbix from "@/components/Charts/Zabbix";

//Formulario para crear un nuevo dashboard
function Form ({ onCancel, onSubmit, defaultValues,submitting }) {

    const { handleSubmit, control, formState: { errors } } = useForm({defaultValues:defaultValues});

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormControl isInvalid={errors.title}>
                            <FormLabel htmlFor="title">Título</FormLabel>
                            <Input id="title" {...field} />
                            {errors.title && (
                                <Text color="red.500">El título es obligatorio</Text>
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="url"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormControl isInvalid={errors.url}>
                            <FormLabel htmlFor="url">URL</FormLabel>
                            <Input id="url" {...field} />
                            {errors.url && (
                                <Text color="red.500">La URL es obligatoria</Text>
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel htmlFor="description">Descripción</FormLabel>
                            <Input id="description" {...field} />
                        </FormControl>
                    )}
                />



                <Flex direction="row" justifyContent={'right'} gap={3}>
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button colorScheme={'blue'} type="submit" isLoading={submitting}>
                        {defaultValues ? 'Actualizar iframe'  : 'Crear iframe'}
                    </Button>
                </Flex>
            </Stack>
        </form>
    );
}



// Modal para crear un nuevo dashboard
function ModalNewDashboard () {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [submitting, setSubmitting] = useState(false);


    const onSubmit = async (data) => {
        setSubmitting(true);

        // make a POST request to /api/dashboard/add using axios and wrapping it in a try/catch block 
        try {
            const response = await axios.post('/api/dashboard/add', data);
            console.log(response);
            onClose();
            mutate('/api/dashboard/getMyDashboard');
        } catch (error) {
            // use toastr to show the error
            toastError('Ocurrió un error al crear el iframe')
            console.error(error);
        }


        setSubmitting(false);
    };

    return (
        <>
            <Tooltip label="Nuevo iframe" placement="top">
                <Button onClick={onOpen} _hover={{ bg: '#D5E0EC', fontWeight: 'bold' }} fontWeight={'normal'} color={'#2b6cb0'}>
                    <MdAdd color="#2b6cb0" />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(5px)' />
                <ModalContent>
                    <ModalHeader>Nuevo iframe</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Form onCancel={onClose} onSubmit={onSubmit} submitting={submitting}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}


// Component that display in a ChakraUI Modal component the title and description of a dashboard
// also, it has a button to delete the dashboard
function DashboardModalDelete ({ dashboard }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [submitting, setSubmitting] = useState(false);

    const deleteDashboard = async (id) => {
        setSubmitting(true);

        // make a POST request to /api/dashboard/delete using axios and wrapping it in a try/catch block

        try {
            const response = await axios.post('/api/dashboard/delete', { id });
            console.log(response);
            mutate('/api/dashboard/getMyDashboard');
        } catch (error) {
            // use toastr to show the error
            toastError('Ocurrió un error al eliminar el iframe')
            console.error(error);
        }

        setSubmitting(false);
    }

    return (
        <>

            <BsFillTrashFill
                size={'18px'}
                cursor={'pointer'}
                color={'#D75B5B'}
                aria-label="Eliminar"
                onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay bg='blackAlpha.300'

                    backdropFilter='blur(5px)' />
                <ModalContent>
                    <ModalHeader>¿Estás seguro?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Estás a punto de borrar el iframe "{dashboard.title}".</Text>
                        <Text>Esta acción es irreversible.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3}>Cerrar</Button>
                        <Button colorScheme="red" onClick={() => deleteDashboard(dashboard.id)} isLoading={submitting}>
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

// Componenent that display in a ChakraUI Modal component the title and description of a dashboard
// also, it has a button to edit the dashboard
function DashboardModalEdit ({ dashboard }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [submitting, setSubmitting] = useState(false);

    const editDashboard = async (data) => {
        setSubmitting(true);

        // make a POST request to /api/dashboard/edit using axios and wrapping it in a try/catch block

        try {
            const response = await axios.patch(`/api/dashboard/edit`, data);
            mutate('/api/dashboard/getMyDashboard');

            onClose();
        } catch (error) {
            // use toastr to show the error
            toastError('Ocurrió un error al editar el iframe')
            console.error(error);
        }

        setSubmitting(false);
    }

    return (
        <>
            <BiPencil
                size={'18px'}
                cursor={'pointer'}
                aria-label="Editar"
                onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(5px)' />
                <ModalContent>
                    <ModalHeader>Editar iframe</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Form onCancel={onClose} onSubmit={editDashboard} defaultValues={dashboard} submitting={submitting}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}



// Component that display in a ChakraUI List component the title and description of array of dashboards
// also, it has a button to delete the dashboard
function DashboardList ({ dashboards }) {

    return (
        <Stack spacing={1} maxH={'80vh'} overflow={'auto'} mb={2}>
            {dashboards.map((dashboard) => (
                <Box key={dashboard.id} p={3} borderWidth="1px">
                    <Flex
                        direction="row"
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap={3}
                    >
                        <Flex direction="column" justifyContent={'center'} alignItems={'flex-start'}>
                            <Text fontSize="md">{dashboard.title}</Text>
                        </Flex>
                        <Flex direction="row" justifyContent={'center'} alignItems={'center'} gap={3} >
                            <DashboardModalEdit dashboard={dashboard} />
                            <DashboardModalDelete dashboard={dashboard} />
                        </Flex>
                    </Flex>
                </Box>
            ))}
        </Stack>
    );
}



// Modal para configurar iframes
function ModalConfigIframes ({ dashboards }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Tooltip label="Configurar iframes" placement="top">
                <Button onClick={onOpen} _hover={{ bg: '#D5E0EC', fontWeight: 'bold' }} fontWeight={'normal'} color={'#2b6cb0'}>
                    <FiTool color="#2b6cb0" />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay bg='blackAlpha.300'
                    backdropFilter='blur(5px)' />
                <ModalContent>
                    <ModalHeader>Configurar iframes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <DashboardList dashboards={dashboards} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}


const Index = () => {
    const { data, error, mutate } = useSWR('/api/dashboard/getMyDashboard', fetcher);


    return (
        <Container maxW={{base: '100%', md: '190vh'}} p={{base: 0, lg: 5}} mt={5}>

            {
                !data?.error && <Text fontSize={'4xl'} fontWeight={'bold'} textAlign={'center'}>
                    Dashboards
                </Text>
            }


            <Skeleton isLoaded={data}>

                {
                    data?.error &&
                    <BoatError title={'Ocurrió un error al intentar mostrar los dashboards'} />
                }

                {
                    !data?.error && <Flex flexDir={'column'} mt={5}>
                        <Tabs isLazy >
                            <TabList display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
                                <Tab my={1}>
                                    <Text fontSize="md">Clusters</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Offline/Preventivos</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Okam</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Tks Cerrados</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Reiterados</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Instalaciones</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Coordinaciones</Text>
                                </Tab>
                                <Tab my={1}>
                                    <Text fontSize="md">Problemas Frecuentes</Text>
                                </Tab>
                                {
                                    data?.data.length > 0 && data.data.map(dashboard => <Tab key={dashboard.id} maxW={{base: '100%', md: '50vh'}}><Tooltip placement="top" label={dashboard.title}>{dashboard.title.length > 30 ? `${dashboard.title.substring(0, 30)}...` : dashboard.title}</Tooltip></Tab>)
                                }

                                <Box my={1}>
                                    <ModalNewDashboard />
                                    <ModalConfigIframes dashboards={data?.data} />
                                </Box>
                            </TabList>

                            <TabPanels>
                                <TabPanel >   
                                    <ClustersStatus />
                                </TabPanel>
                                <TabPanel >
                                    <ChartZabbix />
                                </TabPanel>
                                <TabPanel >   
                                    <ChartOkam />
                                </TabPanel>
                                <TabPanel >   
                                    <ChartCloseTk />
                                </TabPanel>
                                <TabPanel >                                   
                                    <ChartReiterados />
                                </TabPanel>
                                <TabPanel >   
                                    <ChartInstalaciones />
                                </TabPanel>
                                <TabPanel >   
                                    <ChartCoordinationsByWorker />
                                </TabPanel>
                                <TabPanel >   
                                    <ChartProblemasFrecuentes />
                                </TabPanel>
                                {
                                    data?.data.length > 0 && data.data.map(dashboard =>
                                        <TabPanel height={'75vh'} key={dashboard.id}>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={dashboard.url}
                                                allowFullScreen
                                            ></iframe>
                                        </TabPanel>
                                    )
                                }
                            </TabPanels>

                        </Tabs>
                    </Flex>
                }

            </Skeleton>

        </Container>
    )
}

export default Index;