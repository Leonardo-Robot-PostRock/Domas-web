import { Flex, ListItem, UnorderedList, useColorModeValue, Container, Text, Badge, Tooltip, Box, Button, Link, Spacer, Textarea, Icon, Spinner } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { FaLink, FaUnlink, FaRegQuestionCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { use, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/Fetcher";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc.js';
import { datetimeFromNow } from "@/utils/Datetime";
import { toastError, toastSuccess } from '@/components/Toast';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Mendoza');


const Index = () => {
    const [error, setError] = useState();
    const [tickets, setTickets] = useState();

    const { data } = useSWR(`/api/ticket/verified`, fetcher);

    useEffect(() => {
        if (data) {
            if (data.message) {
                setError(data.message);
            }
            else {
                let filteredData = data.tickets.filter(ticket => ticket.ticket_status != 'CERRADO');
                setTickets(filteredData);
            }
        }
    }, [data]);


    return (
        <Box>
            <Container maxW={'3xl'} spacing={{ base: 8, md: 14 }} centerContent
                py={{ base: 20, md: 25 }} mt={5} mb={5} backgroundColor={useColorModeValue('white', '#191d32')} borderRadius={20} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}>
                <Toaster />
                <Text mb={'30px'} fontSize='4xl' fontWeight={'bold'} textAlign={'center'}> Verificación de Tickets </Text>
                {
                    tickets && tickets.length > 0 ? 
                    <UnorderedList listStyleType={"none"} ml={0} w='95%'>
                        {
                            tickets.map((ticket, index) => {
                                return (
                                    <ListItem key={index}>
                                        <TicketCard data={ticket} order={index} />
                                    </ListItem>
                                )
                            })
                        }
                    </UnorderedList>
                    :
                    tickets && tickets.length == 0 ?
                        <p style={{textAlign: 'center'}}> No hay tickets pendientes de verificación. </p>                        
                    : 
                    error ? 
                        <p style={{textAlign: 'center'}}> {error} </p>
                        :
                        <p> Cargando tickets... </p>
                }
            </Container>
        </Box>
    )
}

const TicketCard = ({data, order}) => {
    const { customer, id: ticketID, team_name, ticket_category, Ticket_history } = data;
    let ticketStatus = Ticket_history.length > 0? Ticket_history[0].ticket_status : '-';
    const color = useColorModeValue('#273D54', '#AAAFC5');

    const [open, setOpen] = useState(false);
    

    return (
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

                                <Tooltip label={`Estado del Ticket`}>
                                    <Badge colorScheme={'teal'} mt={2}>
                                        <Text m={0} color={color} fontSize={'12px'} fontWeight={'medium'}>
                                            {ticketStatus}
                                        </Text>                                        
                                    </Badge>
                                </Tooltip>

                                <Spacer />

                                <Tooltip label={`ST Asignado`}>
                                    <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                                        <MdIcon.MdPeople style={{ display: 'inline' }} />
                                        <Text m={0} color={color} fontSize={'12px'} fontWeight={'medium'}>
                                            {team_name? team_name : 'Sin asignar'}
                                        </Text>                                        
                                    </Box>
                                </Tooltip> 

                                <Badge colorScheme={customer.geocode.latitude? 'green' : 'red'} mt={2}>
                                    {/* <Link color={color} href={`https://www.google.com/maps/search/?api=1&query=${customer.geocode.latitude},${customer.geocode.longitude}`} isExternal> */}
                                    <Link color={color} fontWeight={'medium'} href={`http://mesa.westnet.com.ar/mapa/clientes/${customer.code}:${customer.customer_id}`} isExternal>
                                        <MdIcon.MdLocationPin style={{ display: 'inline', alignSelf: 'center' }} />                                    
                                        GEO  
                                    </Link>                                   
                                </Badge>
                            </Flex>

                            <Text fontWeight={'semibold'} fontSize={'16px'} color={color} mt={2}>
                                {customer.code} - {customer.lastname.toUpperCase()} {customer.name.toUpperCase()}
                            </Text>

                        </Flex>
                        <Flex flexDirection={'column'}>
                            <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'} ml={1}>
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
                        { open && <InsideDataCard data={data} open={open} ticketStatus={ticketStatus}/> }
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    )
}

const InsideDataCard = ({data, open, ticketStatus}) => {
    const { customer, id, ticket_status } = data;
    let phones = [ customer.phone, customer.phone2, customer.phone3, customer.phone4 ];
    phones = phones.filter(p => {
        if(p) return `${p}, `;
    });
    const color = useColorModeValue('#273D54', '#AAAFC5');

    const [comment, setComment] = useState('');
    const [submitButton, setSubmitButton] = useState({
        disabled: false,
        text: 'Necesita ST'
    });
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const [closeButton, setCloseButton] = useState({
        disabled: false,
        text: 'Cerrar Ticket'
    });
    const [okamConnectionStatus, setOkamConnectionStatus] = useState({ 
        status: 'loading', 
        message: 'Verificando estado de conexión...', 
        tech: null, 
        verifiedAt: null 
    });


    const checkOkam = async (customer_code) => {

        await axios.get(`/api/okam/status/${customer_code}?ticket_id=${id}`)
        .then(res => {
            setOkamConnectionStatus({
                status: 'online',
                message: `El cliente cuenta con conexión!`,
                tech: res.data.tech,
                verifiedAt: new Date()
            });
        })
        .catch(err => {
            const { status } = err.response;
            let statusMessage = null, statusValue;

            if (status == 404) {
                statusMessage = 'unknown';
                statusValue = 'No se encontró en Disponibilidad.';
            } else if (status >= 400 && status < 500) {
                statusMessage = 'offline';
                statusValue = 'Necesita servicio técnico.';
            } else {
                statusMessage = 'unknown';
                statusValue = 'No se pudo verificar el estado de conexión debido a un error inesperado.';
            }

            setOkamConnectionStatus({
                status: statusMessage,
                message: statusValue,
                tech: err.response?.data?.okam_response?.tech || null,
                verifiedAt: new Date()
            });
        });
    }

    useEffect(() => {
        if (open){
            checkOkam(customer.code);
        }
    }, [open]);


    const handleSubmit = async () => {

        if (comment != ''){
            let formData = {
                ticket_status: ticketStatus,
                ticket_id: id,
                comment: comment                
            }

            await axios.put('/api/ticket/verified', formData)
            .then(res => {
                setIsSubmitSuccessful(true);
                setSubmitButton({ disabled: true, text: 'Ticket Actualizado' });   
                setCloseButton({ disabled: true , text: 'Cerrar Ticket' }); 
                toastSuccess('Ticket actualizado correctamente.');
                
                return res.data;
            })
            .catch(err => {
                console.log(err);
                toastError('Hubo un error al actualizar el ticket.');

                return err.response.data;
            });
        }
        else{
            toastError('Se debe incluir un comentario.');
        }         
    };
   

    const handleClose = async () => {

        if (comment != ''){

            let formData = {
                ticket_status: 'CERRADO',
                ticket_id: id,
                comment: comment                
            }
    
            await axios.post('/api/ticket/verified', formData)
            .then(res => {
                setIsSubmitSuccessful(true);
                setSubmitButton({ disabled: true, text: 'Necesita ST' });   
                setCloseButton({ disabled: true , text: 'Ticket Cerrado' }); 
                toastSuccess('Ticket actualizado correctamente.');

                return res.data;               
            })
            .catch(err => {
                console.log(err.response);
                toastError('Hubo un error al actualizar el ticket.');

                return err.response.data;
            });         
        }
        else{
            toastError('Se debe incluir un comentario.');
        }       
        
    };

   
    let handleInputChange = (e) => {
        let inputValue = e.target.value;
        setComment(inputValue);
    };

    useEffect(() => {
        if(isSubmitSuccessful){
            setTimeout(() => {
                window.location.reload(true)
            }, 2000);
        }
    }, [isSubmitSuccessful]);

    return (
        <Box backgroundColor={useColorModeValue('white', '#191d32')} p={3} borderRadius={20} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}>
            <Tooltip label={`Telefonos`}>
                <Box display={'flex'} alignItems={'normal'} mt={2} gap={1} bg={'transparent'} placeItems={'center'}>
                    <MdIcon.MdPhone style={{ display: 'inline' }} />                                    
                    <Text m={0} pl={2} color={color} fontSize={'13px'}>
                        {phones.join(', ')}    
                    </Text>                          
                </Box>
            </Tooltip>  

            <Tooltip label={`Dirección`}>
                <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                    <MdIcon.MdLocationPin style={{ display: 'inline', alignSelf: 'center' }} />                                    
                    <Text m={0} pl={2} color={color} fontSize={'13px'}>
                        {customer.address}    
                    </Text>                          
                </Box>
            </Tooltip>

            {
                okamConnectionStatus.status == 'loading'? 
                <Tooltip label={'Estado de conexión'}>
                    <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                        <Spinner mt={2} mr={2} height={'2vh'} width={'2vh'} />
                        <Text m={0} pl={2} color={color} fontSize={'13px'}>
                            {okamConnectionStatus.message.toUpperCase()}    
                        </Text>
                    </Box>
                </Tooltip>
                :
                okamConnectionStatus.status == null || okamConnectionStatus.status == 'unknown' ? 
                <Tooltip label={'Estado de conexión'}>
                    <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                        <Icon as={FaRegQuestionCircle} style={{ display: 'inline', alignSelf: 'center' }}/>
                        <Text m={0} pl={2} color={color} fontSize={'13px'}>
                            {okamConnectionStatus.message.toUpperCase()}    
                        </Text>
                    </Box>
                </Tooltip>
                :
                okamConnectionStatus.status == 'online'? 
                <Tooltip label={'Estado de conexión'}>
                    <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                        <Icon as={okamConnectionStatus.tech == 'wireless' ? MdIcon.MdOutlineSignalWifiStatusbar4Bar : FaLink} style={{ display: 'inline', alignSelf: 'center' }} color={'#45B05F'} />
                        <Text m={0} pl={2} color={color} fontSize={'13px'} fontWeight={'medium'}>
                            {okamConnectionStatus.message.toUpperCase()} {okamConnectionStatus.verifiedAt ? `(Verificado ${datetimeFromNow(okamConnectionStatus.verifiedAt)})` : ''}    
                        </Text>
                    </Box>
                </Tooltip>
                :
                okamConnectionStatus.status == 'offline' && 
                <Tooltip label={'Estado de conexión'}>
                    <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                        <Icon as={okamConnectionStatus.tech == 'wireless' ? MdIcon.MdOutlineSignalWifiOff : FaUnlink} style={{ display: 'inline', alignSelf: 'center' }} color={'red'} />
                        <Text m={0} pl={2} color={color} fontSize={'13px'}>
                            {okamConnectionStatus.message.toUpperCase()} {okamConnectionStatus.verifiedAt ? `(Verificado ${datetimeFromNow(okamConnectionStatus.verifiedAt)})` : ''}
                        </Text>
                    </Box>
                </Tooltip>
            }

            <FormControl isRequired>
                <FormLabel mt={10} fontSize={'17px'} fontWeight={'medium'}>Comentario</FormLabel>
                <Textarea size='sm' placeholder='Ejemplo: El cliente ya cuenta con servicio.' onChange={handleInputChange} />
                <FormHelperText>Este comentario se agregará también al ticket en Mesa.</FormHelperText>
            </FormControl>
            
            
              
            <Flex align="center" justify="center" gap={5} mt={6}>
                <Button colorScheme={'telegram'} disabled={closeButton.disabled} width='35%' fontSize={'15px'} fontWeight={'semibold'} onClick={() => handleClose()} >{closeButton.text}</Button>
                <Button colorScheme={'telegram'} disabled={submitButton.disabled} width='35%' fontSize={'15px'} fontWeight={'semibold'} onClick={() => handleSubmit()}>{submitButton.text}</Button>
            </Flex>
                        
        </Box>
    )
}

export default Index;
