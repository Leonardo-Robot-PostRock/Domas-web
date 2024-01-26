import { Box, Flex, Button, Badge, Text, Link, Tooltip, Divider, Icon, Input, Checkbox, Textarea, Spinner, UnorderedList, ListItem  } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import { colord } from "colord";
import { toastError, toastSuccess } from "@/components/Toast.js";
import { useRouter } from 'next/router';
import { MdQuestionMark, MdCheckCircleOutline } from "react-icons/md";
import { convertirCoordenadas } from "@/utils/Geolocation";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

export const EditTicket = ({ ticket, isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [labels, setLabels] = useState([]);
    const [users, setUsers] = useState([]);
    const status = [
        { value: 'nuevo', label: 'Nuevo' },
        { value: 'en espera', label: 'En espera' },
        { value: 'en curso (asignado)', label: 'En curso (Asignado)' },
        { value: 'en curso (planificado)', label: 'En curso (Planificado)' },
        { value: 'cerrado (resuelto)', label: 'Cerrado (Resuelto)' },
        { value: 'cerrado (no resuelto)', label: 'Cerrado (No resuelto)' },
    ];

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({})

    const categoriesSelectValues = (categorias, padreId = null, nivel = 0) => {
        const opciones = [];
            
        // Filtrar categorías por el padreId y ordenar por nombre
        const categoriasFiltradas = categorias.filter(categoria => categoria.padre_id === padreId);
        categoriasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
        categoriasFiltradas.forEach(categoria => {
            const nombreConGuiones = '--'.repeat(nivel) + categoria.nombre;
            opciones.push({ value: categoria.id, label: nombreConGuiones });
        
            // Llamada recursiva para manejar las categorías hijas
            const categoriasHijas = categoriesSelectValues(categorias, categoria.id, nivel + 1);
            opciones.push(...categoriasHijas);
        });
    
        return opciones;
    }

    const onSubmit = (data) => {
        data.category = data.category? data.category.value : ticket.categoria_id;
        data.assigned_to = data.assigned_to? data.assigned_to.value : ticket.asignado_id;
        data.status = data.status? data.status.value : ticket.estado;
        data.labels = data.labels? data.labels.map(label => {
            return label.value
        }) : ticket.etiquetas? ticket.etiquetas.map(etiqueta => {
            return etiqueta.etiqueta_id
        }) : null;

        const userInfo = JSON.parse(localStorage.getItem('user'));
        data.author = userInfo.mesa_username;
        
        axios.put(`/api/mesa/ticket/update?ticket_id=${ticket.id}`, data)
            .then(res => {
                toastSuccess('Ticket actualizado');
                handleOnClose();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(err => {
                //console.log(err);
                toastError('Ocurrio un error al tratar de actualizar el ticket');
            });
    }

    const handleOnClose = () => {
        onClose();
        reset();
    }
    
    useEffect(() => {
        if(isOpen){
            axios.get(`/api/mesa/getMesaFormDataFields`)
                .then(res => {
                    let categorias = categoriesSelectValues(res.data.categories);
                    setCategories(categorias);

                    let etiquetas = res.data.labels.map(label => {
                        return {
                            value: label.id,
                            label: label.etiqueta,
                            color: colord(label.color).alpha(0.5).toHex()
                        }
                    });
                    setLabels(etiquetas);

                    let usuarios = res.data.users.map(user => {
                        return {
                            value: user.id,
                            label: user.nombre
                        }
                    });
                    setUsers(usuarios);
                })
                .catch(err => {
                    //console.log(err);
                    toastError('Ocurrio un error al obtener los datos de categorias y usuarios');
                });
        }
    }, [isOpen]);

    const customSelectStyles = {
        control: base => ({
            ...base,
            minHeight: 35,
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
        }),
        placeholder: base => ({
            ...base,
            fontSize: '14px'
        }),
        multiValue: (base, state) => ({
            ...base,
            border: '1px solid #CBD5E0',
            backgroundColor: state.data.color,
        })
    };
    

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    { (categories.length > 0 && labels.length > 0 && users.length > 0) ?
                        <>
                            <FormControl>
                                <FormLabel>Categoría</FormLabel>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={categories}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                            defaultValue={categories.find(c => c.value === ticket.categoria_id)}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Asignado a</FormLabel>
                                <Controller
                                    control={control}
                                    name="assigned_to"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={users}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                            defaultValue={users.find(c => c.value === ticket.asignado_id)}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Estado</FormLabel>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={status}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                            defaultValue={status.find(c => c.value === ticket.estado)}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl mt={4} isInvalid={errors.description}>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea
                                    {...register("description", { required: true })}
                                    placeholder="Descripción..."
                                    size={"sm"}
                                />
                                {errors.description && <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>}
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Etiquetas</FormLabel>
                                <Controller
                                    control={control}
                                    name="labels"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            isMulti={true}
                                            closeMenuOnSelect={false}
                                            options={labels}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                            defaultValue={ticket.etiquetas? labels.filter(c => ticket.etiquetas.map(e => e.etiqueta_id).includes(c.value)) : null}
                                        />
                                    )}
                                />
                            </FormControl>
                        </>
                        :
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                            <Spinner />
                        </Box>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit(onSubmit)}>
                        Actualizar
                    </Button>
                    <Button onClick={handleOnClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export const NewTicket = ({ isOpen, onClose, customer }) => {
    const [categories, setCategories] = useState([]);
    const [labels, setLabels] = useState([]);
    const [users, setUsers] = useState([]);

    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({})

    const categoriesSelectValues = (categorias, padreId = null, nivel = 0) => {
        const opciones = [];
            
        // Filtrar categorías por el padreId y ordenar por nombre
        const categoriasFiltradas = categorias.filter(categoria => categoria.padre_id === padreId);
        categoriasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
        categoriasFiltradas.forEach(categoria => {
            const nombreConGuiones = '--'.repeat(nivel) + categoria.nombre;
            opciones.push({ value: categoria.id, label: nombreConGuiones });
        
            // Llamada recursiva para manejar las categorías hijas
            const categoriasHijas = categoriesSelectValues(categorias, categoria.id, nivel + 1);
            opciones.push(...categoriasHijas);
        });
    
        return opciones;
    }

    const onSubmit = (data) => {

        if(data.description.trim() === '' || data.description.length < 10) {
            toastError('La descripción es obligatoria y debe tener al menos 10 caracteres');
            return false;
        }

        data.assigned_to = data.assigned_to.value;
        data.category = data.category.value;
        data.labels = data.labels?.map(label => {
            return label.value
        }) || [];

        data.customer = {
            code: customer.code,
            contract_id: customer.contract_id
        }

        const userInfo = JSON.parse(localStorage.getItem('user'));
        data.author = userInfo.mesa_username;
  
        //console.log(data);

        axios.post(`/api/mesa/ticket/new`, data)
            .then(res => {
                onClose();
                reset();
                //console.log(res.data);
                // redirect to ticket page
                router.push(`/mesa/ticket/${res.data.ticket_id}`);                
            })
            .catch(err => {
                //console.log(err);
                toastError('Error al crear el ticket');
            });
    }

    const handleOnClose = () => {
        onClose();
        reset();
    }
    
    useEffect(() => {
        if(isOpen){
            axios.get(`/api/mesa/getMesaFormDataFields`)
                .then(res => {
                    let categorias = categoriesSelectValues(res.data.categories);
                    setCategories(categorias);

                    let etiquetas = res.data.labels.map(label => {
                        return {
                            value: label.id,
                            label: label.etiqueta,
                            color: colord(label.color).alpha(0.5).toHex()
                        }
                    });
                    setLabels(etiquetas);

                    let usuarios = res.data.users.map(user => {
                        return {
                            value: user.id,
                            label: user.nombre
                        }
                    });
                    setUsers(usuarios);
                })
                .catch(err => {
                    //console.log(err);
                });
        }
    }, [isOpen]);

    const customSelectStyles = {
        control: base => ({
            ...base,
            minHeight: 35,
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
        }),
        placeholder: base => ({
            ...base,
            fontSize: '14px'
        }),
        multiValue: (base, state) => ({
            ...base,
            border: '1px solid #CBD5E0',
            backgroundColor: state.data.color,
        })
    };

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Nuevo ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    { (categories.length > 0 && labels.length > 0 && users.length > 0) ?
                        <>
                            <FormControl>
                                <FormLabel>Categoría</FormLabel>
                                <Controller
                                    control={control}
                                    name="category"
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={categories}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}                                            
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Asignado a</FormLabel>
                                <Controller
                                    control={control}
                                    name="assigned_to"
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            options={users}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                        />
                                    )}
                                />
                            </FormControl>
                            
                            <FormControl mt={4} isInvalid={errors.description}>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea
                                    {...register("description", { required: true })}
                                    placeholder="Descripción..."
                                    size={"sm"}
                                />
                                {errors.description && <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>}
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Etiquetas</FormLabel>
                                <Controller
                                    control={control}
                                    name="labels"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            autoFocus={true}
                                            isSearchable={true}
                                            isMulti={true}
                                            closeMenuOnSelect={false}
                                            options={labels}
                                            styles={customSelectStyles}
                                            placeholder={'Seleccionar...'}
                                        />
                                    )}
                                />
                            </FormControl>
                        </>
                        :
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                            <Spinner />
                        </Box>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit(onSubmit)}>
                        Crear
                    </Button>
                    <Button onClick={handleOnClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export const CoordinateTicket = ({ ticket, geo, isOpen, onClose }) => {
    const [alertInDumas, setAlertInDumas] = useState(null);
    const [alertCreateTk, setAlertCreateTk] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dumasTk, setDumasTk] = useState(null);
    const [turns, setTurns] = useState(null);
    const [shifts, setShifts] = useState(null);
    const [date, setDate] = useState(null);
    const [visitHour, setVisitHour] = useState(null);
    const [coordinationSuccesful, setCoordinationSuccesful] = useState(false);

    const { register, control, handleSubmit } = useForm();

    let mesaCategories = ['SIN INTERNET','SIN INTERNET FO', 'ANTI-BAJA SERVICIO TÉCNICO', 'VELOCIDAD', 'VELOCIDAD FO',
        'CLIENTE PIDE TÉCNICO', 'SIN INTERNET - SANTA TERESITA', 'REDIRECCIONAR', 'WIFI HOME', 'ROUTER - CONF. ROUTER',
        'CAMBIO DE VELOCIDAD', 'CAMBIO DE VELOCIDAD FIBRA', 'MOVIMIENTO DE CPE', 'MICROCORTES FO', 'MICROCORTES WIRELESS',
        'GARANTIA INSTALACION FO', 'POR GARANTIA INSTALACION', 'GARANTIA DE SERVICIO TECNICO', 'FCR CALL TÉCNICO',
        'INSTALACIONES','INSTALACIONES FIBRA','INSTALACIONES FIBRA DECIMO','INSTALACIONES EXTENSIBLE', 'CLIENTE REITERA RECLAMO', 
        'CAMBIO DE VELOCIDAD ST', 'CONFIGURACION DE ROUTER', 'MEJORAR VALORES', 'REDIRECCIONAMIENTOS PRIORIDAD ALTA', 
        'REDIRECCIONAR - MANTENIMIENTO'
    ]

    const handleOnClose = () => {
        setAlertInDumas(null);
        setAlertCreateTk(null);
        setDumasTk(null);
        setTurns(null);
        setShifts(null);
        setDate(null);
        setVisitHour(null);
        setCoordinationSuccesful(false);
        onClose();
    }

    const onSubmit = async () => {
        if(!date || !visitHour) {
            toastError('Fecha y Horario son obligatorios');
            return;
        }
        setIsLoading(true);
        let tk = dumasTk;
        tk.ticket_id = ticket.id;
        tk.ticket_status = 'COORDINADO';
        tk.appointment_date = date;
        tk.visiting_hours = visitHour;
        tk.priority = false;

        if(tk.visiting_hours == 'first_turn'){
            tk.priority = true;
            tk.visiting_hours = 'morning';
        }
                
        await axios.put('/api/ticket/update', tk)
        .then(res => {
            //console.log(res.data);
            toastSuccess(res.data.message);
            setCoordinationSuccesful(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);         
        })
        .catch(err => {
            //console.log(err);
            toastError('Error al actualizar el ticket');
        });

        setIsLoading(false);
    }

    const addTicketToDumas = () => {
        setIsLoading(true);
        setAlertInDumas(null); 

        axios.post('/api/ticket/create', {
            ticket_id: ticket.id
        })
        .then(res => {
            //console.log(res.data);
            getTicketFromDumas();
        })
        .catch(err => {
            //console.log(err);    
            setAlertCreateTk({
                status: err.response?.status || 500,
                message: err.response?.data?.message || 'Error al crear el ticket.'
            });       
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const getTicketFromDumas = () => {
        axios.get(`/api/ticket/search?ticket_id=${ticket.id}`)
        .then(res => {
            //console.log(res.data);
            setAlertInDumas(null);
            setDumasTk(res.data);
            turnsAvailable(res.data.team_id);
        })
        .catch(err => {
            //console.log(err);
            let message = err.response?.status == 404 ? 'El ticket no existe en Do+.' : 'Error al buscar el ticket.';

            setAlertInDumas({
                status: err.response?.status || 500,
                message: message
            });
        }); 
    }

    const turnsAvailable = (team_id) => {
        axios.get(`/api/mesa/callcenter/getTeamTurnsAvailable?team_id=${team_id}`)
        .then(res => {
            //console.log(res.data);
            let daysAvailables = res.data.map(turn => {
                return {
                    label: turn.day,
                    value: turn.day
                }
            });
            setTurns({data: res.data, days: daysAvailables, shifts: null});
        })
        .catch(err => {
            //console.log(err);
            toastError(err.response?.data?.message || 'Error al buscar los turnos disponibles');
            setTurns({error: true});
            return err;
        });
    };

    const handleSelectedDate = (e) => {
        let day = turns.data.filter(turn => turn.day == e.value)[0];
        let shift = [];

        if(day.first_turn) {
            shift.push({label: 'Primer Turno', value: 'first_turn'});
        }
        if(day.morning > 0) {
            shift.push({label: 'Mañana', value: 'morning'});
        }
        if(day.afternoon > 0) {
            shift.push({label: 'Tarde', value: 'afternoon'});
        }
        if(day.all_day) {
            shift.push({label: 'Todo el día', value: 'all_day'});
        }
        
        setDate(dayjs(e.value, 'DD/MM/YYYY').$d);
        setShifts(shift);
    }

    const customSelectStyles = {
        control: base => ({
            ...base,
            minHeight: 35,
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
        }),
        placeholder: base => ({
            ...base,
            fontSize: '14px'
        }),
        multiValue: (base, state) => ({
            ...base,
            border: '1px solid #CBD5E0',
            backgroundColor: state.data.color,
        })
    };

    useEffect(() => {
        if(isOpen) {
            getTicketFromDumas();
        }
    }, [isOpen]);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Coordinar Visita</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    { alertInDumas || alertCreateTk ? 
                        alertInDumas ?
                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                                <Text fontWeight={'medium'}> {alertInDumas.message} </Text>
                                <Text fontSize={'sm'} mt={3}>Antes de agregar un ticket asegurese de que el cliente tiene la geolocalización correcta, si no tiene deberá agregarla primero para que se habilite el botón.</Text>
                                <Button mt={3} colorScheme={'green'} onClick={addTicketToDumas} size={'sm'} variant={'outline'} isLoading={isLoading} isDisabled={alertInDumas.status != 404 || !geo}>Agregar Tk a Do+</Button>
                            </Box>
                            :
                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                                <Text fontWeight={'medium'} textAlign={'center'}> 
                                    {alertCreateTk.message} 
                                    { alertCreateTk.status == 404 &&
                                        <Tooltip label={mesaCategories.join(', ')} placement={'top'}>
                                            <span>
                                                <Icon as={MdQuestionMark} ml={3} boxSize={4} bg={'white'} rounded={'full'} border={'1px solid black'}/>
                                            </span>
                                        </Tooltip>
                                    }
                                </Text>                                
                            </Box>
                        : dumasTk ?
                        <Box>
                            <Text fontWeight={'medium'}>Equipo asignado: {dumasTk.team_name}</Text>
                            <Text fontWeight={'medium'}>Cluster: {dumasTk.cluster}</Text>
                            <Text fontWeight={'medium'}>Estado: <Badge colorScheme={dumasTk.ticket_status == 'PENDIENTE' ? 'green' : 'red'}>{dumasTk.ticket_status}</Badge></Text>
                            
                            <Divider my={3}/>
                            { turns?
                                turns.error ? 
                                    <Text textAlign={'center'} mt={5}>
                                        No se puede asignar un turno
                                    </Text>
                                    : !isLoading ?
                                        coordinationSuccesful ?
                                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={5} w={'100%'}>
                                            <Icon as={MdCheckCircleOutline} color={'green.500'} boxSize={7} />
                                            <Text ml={3} textAlign={'center'}> El ticket se coordino correctamente </Text>                                                
                                        </Box>
                                        :
                                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} mt={5} w={'100%'}>
                                            <Text mb={3} fontWeight={'medium'} fontSize={'lg'}>Turnos Disponibles</Text>
                                            <FormControl w={'80%'}>
                                                <FormLabel>Fecha</FormLabel>
                                                <Controller
                                                    control={control}
                                                    name="appointment_date"
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            autoFocus={true}
                                                            isSearchable={true}
                                                            options={turns.days}
                                                            styles={customSelectStyles}
                                                            onChange={handleSelectedDate}
                                                            placeholder={'Seleccionar...'}                                            
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            { shifts &&
                                                <FormControl w={'80%'} mt={3}>
                                                    <FormLabel>Horario</FormLabel>
                                                    <Controller
                                                        control={control}
                                                        name="visit_hour"
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                autoFocus={true}
                                                                isSearchable={true}
                                                                options={shifts}
                                                                styles={customSelectStyles}
                                                                onChange={(e) => setVisitHour(e.value)}
                                                                placeholder={'Seleccionar...'}                                            
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            }
                                        </Box>
                                    : 
                                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={10} h={'100%'} w={'100%'}>
                                        <Spinner thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.200'
                                            color='blue.500'
                                            size='xl' 
                                        />
                                    </Box>
                                :
                                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={5} h={'100%'} w={'100%'}>
                                    <Spinner size='xs' />
                                    <Text fontSize={'sm'} ml={3}>Cargando turnos...</Text>
                                </Box>                                
                            }
                        </Box>
                        : 
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                            <Spinner />
                        </Box>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onSubmit} isDisabled={!dumasTk || isLoading || turns?.error} isLoading={isLoading}>
                        Coordinar
                    </Button>
                    <Button onClick={handleOnClose} isDisabled={isLoading}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export const MassiveUpdate = ({ isOpen, onClose, clearSelectedRows, tickets }) => {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const status = [
        { value: 'nuevo', label: 'Nuevo' },
        { value: 'en espera', label: 'En espera' },
        { value: 'en curso (asignado)', label: 'En curso (Asignado)' },
        { value: 'en curso (planificado)', label: 'En curso (Planificado)' },
        { value: 'cerrado (resuelto)', label: 'Cerrado (Resuelto)' },
        { value: 'cerrado (no resuelto)', label: 'Cerrado (No resuelto)' },
    ];

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({})

    const onSubmit = (data) => {

        data.category = data.category? data.category.value : null;
        data.assigned_to = data.assigned_to? data.assigned_to.value : null;
        data.status = data.status? data.status.value : null;
        
        const userInfo = JSON.parse(localStorage.getItem('user'));
        data.author = userInfo.mesa_username;

        const ticketsIds = tickets.map(t => t.id);
        data.tickets = ticketsIds;
        
        axios.patch(`/api/mesa/ticket/update`, data)
            .then(res => {
                toastSuccess('Tickets actualizados correctamente');
                clearSelectedRows(true);
                handleOnClose();                
            })
            .catch(err => {
                //console.log(err);
                toastError('Ocurrio un error al tratar de actualizar los tickets');
            });

    }

    const handleOnClose = () => {
        reset();
        onClose();
    }

    const categoriesSelectValues = (categorias, padreId = null, nivel = 0) => {
        const opciones = [];
            
        // Filtrar categorías por el padreId y ordenar por nombre
        const categoriasFiltradas = categorias.filter(categoria => categoria.padre_id === padreId);
        categoriasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
        categoriasFiltradas.forEach(categoria => {
            const nombreConGuiones = '--'.repeat(nivel) + categoria.nombre;
            opciones.push({ value: categoria.id, label: nombreConGuiones });
        
            // Llamada recursiva para manejar las categorías hijas
            const categoriasHijas = categoriesSelectValues(categorias, categoria.id, nivel + 1);
            opciones.push(...categoriasHijas);
        });
    
        return opciones;
    }

    useEffect(() => {
        if(isOpen){
            axios.get(`/api/mesa/getMesaFormDataFields`)
                .then(res => {
                    let categorias = categoriesSelectValues(res.data.categories);
                    setCategories(categorias);

                    let usuarios = res.data.users.map(user => {
                        return {
                            value: user.id,
                            label: user.nombre
                        }
                    });
                    setUsers(usuarios);
                })
                .catch(err => {
                    //console.log(err);
                    toastError('Ocurrio un error al obtener los datos de categorias y usuarios');
                });
        }
    }, [isOpen]);

    const customSelectStyles = {
        control: base => ({
            ...base,
            minHeight: 35,
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
        }),
        placeholder: base => ({
            ...base,
            fontSize: '14px'
        }),
        multiValue: (base, state) => ({
            ...base,
            border: '1px solid #CBD5E0',
            backgroundColor: state.data.color,
        })
    };

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Actualizar Tickets</ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
                { (categories.length > 0 && users.length > 0) ?
                    <>
                        <FormControl>
                            <FormLabel>Categoría</FormLabel>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={categories}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Asignado a</FormLabel>
                            <Controller
                                control={control}
                                name="assigned_to"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={users}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Estado</FormLabel>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        autoFocus={true}
                                        isSearchable={true}
                                        options={status}
                                        styles={customSelectStyles}
                                        placeholder={'Seleccionar...'}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl mt={4} isInvalid={errors.description} isRequired>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                {...register("description", { required: true })}
                                placeholder="Descripción..."
                                size={"sm"}
                            />
                            {errors.description && <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>}
                        </FormControl>                        
                    </>
                    :
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'} w={'100%'}>
                        <Spinner />
                    </Box>
                }
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleSubmit(onSubmit)}>
                    Actualizar
                </Button>
                <Button onClick={handleOnClose}>Cancelar</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const ChangeGeoModal = ({ customer, isOpen, onClose }) => {
    const [coordinates, setCoordinates] = useState();
    const [warning, setWarning] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [disableUpdate, setDisableUpdate] = useState(true);

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        coordinates: '',
    });


    const onSubmit = data => {
        setLoadingSubmit(true);

        if (!coordinates) {
            toastError('Error al guardar datos ingresados.');

            return false;
        }

        let test_coordinates = convertirCoordenadas(coordinates);

        if (!test_coordinates){
            setWarning('Las coordenadas ingresadas o el link de google maps no es válido.');
        }

        data.customer_code = customer.code;
        data.coordinates = test_coordinates;

        axios.post('/api/mesa/updateCustomerGeo', data)
            .then(res => {
                //console.log(res.data);

                setWarning(null);
                setDisableUpdate(true);
                onClose();

                toastSuccess('Se actualizo la geo con exito!');
            })
            .catch(err => {
                toastError('Ha ocurrido un error al intentar cambiar la geo.');
            })
            .finally(value => setLoadingSubmit(false))
    }

    useEffect(() => {
        if(coordinates) {
            setDisableUpdate(false);
        }
    }, [coordinates]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { setWarning(null); onClose() }}
            size={'lg'}
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cambiar Geo del Cliente</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl>
                            <Box>
                                <Text mb={3} fontSize={16} fontWeight='bold'> Coordenadas </Text>
                                <Input placeholder='-32.853298,-68.690438' size='md' w='100%' onChange={(e) => setCoordinates(e.target.value)} />
                            </Box>

                            {warning &&
                                <Alert fontSize={14} my={4} py={2} status='error'>
                                    <AlertIcon boxSize='15px' /> {warning}
                                </Alert>
                            }
                        </FormControl>

                        <Alert flexDirection='column' fontSize={14} py={2} my={3}>
                            <Flex flexDirection='row' alignItems='center' justifyContent='center'>
                                <AlertIcon />
                                <AlertTitle mt={2} mb={1} fontSize='md'>
                                    Información importante!
                                </AlertTitle>
                            </Flex>
                            <AlertDescription maxWidth='sm'>
                                <UnorderedList>
                                    <ListItem>Asegurese que sea correcta la ubicación del cliente antes de cambiarla</ListItem>    
                                    <ListItem><strong>Luego de actualizar</strong> la geolocalización recargue la información del cliente para ver los cambios</ListItem>
                                </UnorderedList>
                            </AlertDescription>
                        </Alert>

                        <Flex mt={5} justifyContent={'flex-end'}>
                            <Button fontWeight={'normal'} onClick={() => { onClose() }} mr={3} isDisabled={loadingSubmit}>Cancelar</Button>
                            <Button fontWeight={'normal'} isDisabled={disableUpdate} colorScheme='teal' type="submit" isLoading={loadingSubmit} loadingText={'Cambiando geo...'}>
                                Actualizar
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}