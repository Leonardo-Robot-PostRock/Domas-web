import Table from '@/components/Datatable/Table.js';
import { toastError, toastInfo, toastSuccess } from '@/components/Toast.js';
import { Container, Box, Flex, Text, useColorModeValue, useDisclosure, Icon, Button, SimpleGrid, Radio, RadioGroup, Input, HStack, Stack, Checkbox, Link } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, IconButton } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as MdIcon from 'react-icons/md';
import { AiFillTool, AiOutlineCar } from 'react-icons/ai';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from "dayjs";
import axios from "axios";
import fetcher from "@/utils/Fetcher";
import useSWR, { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';


// Variable donde guardo los usuarios
let dataUsers;

const Index = () => {
    const [editInfo, setEditInfo] = useState();

    const { data, error, isLoading } = useSWR('/api/users/all', fetcher);

    // Variables para manejo de modal cuando se edita un registro
    const { isOpen, onOpen, onClose } = useDisclosure();


    let columns = [
        {
            name: '',
            selector: row => (<Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<AiFillTool />}
                variant='solid'
                colorScheme={'blue'}
              />
              <MenuList>
                <MenuItem borderRadius={'0.5vh !important'} onClick={() => { onOpen(); setEditInfo(row) }}><EditIcon mr={'1vh'} />Editar</MenuItem>
              </MenuList>
            </Menu>),
            sortable: true,
            width: '10vh'
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Usuario',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Usuario Mesa',
            selector: row => row.mesa_username,
            sortable: true
        },
        {
            name: 'Rol',
            selector: row => row.roles.map(u => u.rol).join(', '),
            sortable: true
        },
        {
            name: 'Estado',
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Fecha de creación',
            selector: row => dayjs(row.createdAt).format('DD/MM/YYYY'),
            sortable: true
        }
    ]

    useEffect(() => {
        if (data){
            if (data?.error) 
                toastError('Ocurrió un error al intentar mostrar los usuarios.');
            else
                dataUsers = data.users;
        }
    }, [data])

    return (
        <Container maxW='180vh' pt={'5vh'}>
            <Toaster />
            <ModalForm isOpen={isOpen} onClose={onClose} edit={editInfo} />
            {   data?.users.length > 0 &&
                <Table 
                    columns={columns} 
                    data={data.users.sort((a, b) => a.id - b.id)} 
                    isLoading={isLoading} 
                    title={'Usuarios'} 
                    containerWidth={'500vh'} 
                    customButtonHeader={<NewRecord />} 
                    //error={data?.error} 
                />
            }
        </Container>
    )
}

const NewRecord = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <>
        <Button onClick={onOpen} colorScheme='teal'>Nuevo Usuario</Button>
  
        <ModalForm isOpen={isOpen} onClose={onClose} />
      </>
    )
  
}

const ModalForm = ({ isOpen, onClose, edit }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(5px)' />
        <ModalContent >
            <ModalHeader borderBottom={'1px solid #E6EAF0'}>
                <Flex alignItems={'center'} gap={'1vh'}>
                    <MdIcon.MdAddLink size={'3vh'} />
                    <Text textAlign={'left'} fontWeight={'700'} fontSize={{base: 'xl', md: '2xl'}} fontFamily={'inherit'}>
                        {edit ? `Editar usuario ${edit.name}` : 'Nuevo usuario'}
                    </Text>    
                </Flex>
            </ModalHeader>
            <ModalCloseButton />
    
            <ModalBody my={3} >
                <Form closeModal={onClose} edit={edit} />
            </ModalBody>
  
        </ModalContent>
      </Modal>
    )
}

const Form = ({ closeModal, edit }) => {
    const submitUrl = edit ? `/api/users/${edit.id}` : '/api/users/new';
    const submitMethod = edit ? `put` : 'post';

    const options = [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Supervisor' },
        { value: '3', label: 'Coordinador' },
        { value: '4', label: 'Tecnico' },
        { value: '6', label: 'Call Center' },
    ];

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: edit?.name,
            username: edit?.username,
            mesa_username: edit?.mesa_username,
            password: '',
            roles: edit? options.find(o => parseInt(o.value) === edit.roles[0].id ) : null,
            status: edit?.status
        }
    });

    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            height: 40,
            minHeight: 35,
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #CBD5E0'
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

    const onSubmit = async (data) => {
                
        if(data.mesa_username){
            let verifyMesaUsername = await axios.post('/api/users/checkMesaUsername', { mesa_username: data.mesa_username })
                .then((res) => {
                    return true;
                })
                .catch((err) => {
                    //console.log(err.response);
                    if(err.response?.data){
                        if(data.status === 'active')
                            toastError(`${err.response.data.message}..\n Solo se guardaran los cambios si se pasa la cuenta a "inactivo".`);
                        return false;
                    }
                    else{
                        toastError('Hubo un error al verificar el usuario de Mesa.');
                        return false;
                    }
                });
            
            if(!verifyMesaUsername && data.status === 'active')
                return;
        }

        data.roles = [{id: parseInt(data.roles.value)}];

        if (data.password === '') 
            delete data.password;
        
        axios[submitMethod](submitUrl, {user: data})
            .then((res) => {
                mutate("/api/users/all");
                toastSuccess(
                    edit
                        ? 'Usuario modificado exitosamente'
                        : 'Usuario creado exitosamente'
                );
                closeModal();
            })
            .catch((err) => {
                const { data } = err.response;

                toastError(data.message);
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }} onKeyDown={handleKeyDown}>
             <Text fontWeight={'bold'} fontSize={{ base: 18, md: 'xl'}}>
                Datos de usuario
            </Text>

            <FormControl isInvalid={errors.name}>
                <FormLabel>Nombre Completo *</FormLabel>
                <Input type='text' autoFocus={true} {...register("name", { required: 'Este campo es obligatorio' })} />
                {errors.name && <FormErrorMessage>{errors.name?.message}</FormErrorMessage>}
            </FormControl>

            {   !edit &&
                <FormControl isInvalid={errors.username}>
                    <FormLabel>Nombre de usuario *</FormLabel>
                    <Input type='text' autoFocus={true} {...register("username", { required: 'Este campo es obligatorio', pattern: { value: /^[a-z0-9_-]{3,16}$/ig, message: 'El usuario puede contener de 3 a 16 caracteres, solo letras, numeros y - o _. No puede contener espacios.' }})} />
                    {errors.username && <FormErrorMessage>{errors.username?.message}</FormErrorMessage>}
                    <FormHelperText fontSize={14} >Este usuario será utilizado para iniciar sesión en Do+.</FormHelperText>
                    <FormHelperText fontSize={14} >No puede ser igual que el nombre.</FormHelperText>
                    <FormHelperText fontSize={14} >No puede contener espacios.</FormHelperText>
                </FormControl>
            }

            <FormControl isInvalid={errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <Input type='password' autoFocus={true} {...register("password", edit? '' : { required: 'Este campo es obligatorio' })} />
                {errors.password && <FormErrorMessage>{errors.password?.message}</FormErrorMessage>}
                <FormHelperText fontSize={14} >Esta contraseña será utilizada para iniciar sesión en Do+.</FormHelperText>
            </FormControl>

            <FormControl isInvalid={errors.mesa_username}>
                <FormLabel>Usuario de Mesa</FormLabel>
                <Input type='text' autoFocus={true} {...register("mesa_username", { required: 'Este campo es obligatorio' })} />
                <FormHelperText fontSize={14} >Usuario utilizado para iniciar sesión en <Link color={'blue.500'} href={'http://mesa.westnet.com.ar/'} isExternal>Mesa</Link>.</FormHelperText>
            </FormControl>

            <FormControl isInvalid={errors.roles}>
                <FormLabel>Rol *</FormLabel>
                <Controller
                    control={control}
                    name="roles"
                    rules={{ required: true, }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isSearchable={true}
                            isClearable={true}
                            styles={customSelectStyles}
                            options={options}
                            placeholder={'Seleccionar...'}
                            defaultValue={edit? options.find(o => parseInt(o.value) === edit.roles[0].id ) : null}
                        />
                    )}
                />
            </FormControl>

            <FormControl isInvalid={errors.status}>
                <FormLabel>Estado *</FormLabel>
                <Text fontSize={14} mb={3} >Al pasar a inactivo el usuario ya no podrá iniciar sesión en Do+.</Text>
                <Controller
                    control={control}
                    name="status"
                    rules={{ required: true, }}
                    render={({ field }) => (
                        <RadioGroup {...field} >
                            <HStack spacing='24px'>
                                <Radio value='active'>Activo</Radio>
                                <Radio value='inactive'>Inactivo</Radio>
                            </HStack>
                        </RadioGroup>
                    )}
                />
            </FormControl>

            <Flex flexDir={'row'} justifyContent={'center'} gap={'0.5vh'}>
                <Button
                    colorScheme='teal'
                    variant={'ghost'}
                    width={'100%'}
                    onClick={() => closeModal()}
                >
                    Cerrar
                </Button>
                <Button
                    colorScheme='teal'
                    type='submit'
                    width={'100%'}
                >
                    {edit ? `Actualizar usuario` : `Crear usuario`}
                </Button>

            </Flex>
        </form>
    )
}

export default Index;