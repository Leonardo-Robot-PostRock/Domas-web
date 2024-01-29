import Table from '@/components/Datatable/Table.js';
import { WrapItem, Input, Checkbox, Link, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Badge, Button, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, IconButton, Icon, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure, Wrap } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { AiFillTool, AiOutlineCar, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import useSWR, { mutate } from 'swr';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FormValidations } from 'constants/strings.js';
import fetcher from '@/utils/Fetcher.js';
import { toastError, toastInfo, toastSuccess } from '@/components/Toast.js';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { BsInfoCircle } from 'react-icons/bs';
import { CustomModal } from '@/components/CustomModal.js';


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

// Variable donde guardo la url en donde hago el fetch para el listado
let dataUrl;
// Variable donde guardo los equipos
let dataTeams;
// Variable donde guardo el usuario logueado
let userSession;
/**
 * Formulario para crear/editar cuadrilla
 */
const Form = ({ closeModal, edit }) => {
  const submitUrl = edit ? `/api/teams/${edit.id}` : '/api/teams/new';
  const submitMethod = edit ? `patch` : 'post';

  const [showSupervisorField, setShowSupervisorField] = useState(false);
  const [supervisorsDataField, setSupervisorsDataField] = useState([]);
  const [technicianDataField, setTechnicianDataField] = useState([])
  const [primaryFile, setPrimaryFile] = useState([]);
  const [secondaryFile, setSecondaryFile] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [clustersGroup, setClustersGroup] = useState(edit?.clusters ? edit.clusters.map(item => ({ value: item.id, label: item.name })) : []);
  const [areaGroup, setAreaGroup] = useState(edit?.areas ? edit.areas.map(item => ({ value: item.id, label: item.name })) : []);
  const [clustersFav, setClustersFav] = useState(edit?.clusters ? edit.clusters.map(item => ({cluster_id: item.id, isChecked: item.favourite_group == edit.id})) : []);


  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: edit?.name,
      mesa_username: edit?.mesa_username,
      google_calendar_id: edit?.google_calendar_id,
      min_tickets_to_do: edit?.min_tickets_to_do,
      max_tickets_to_do_only_omnichannel: edit?.max_tickets_to_do_only_omnichannel,
      supervisor: edit?.supervisor_id ? { value: edit?.supervisor_id, label: edit?.supervisor } : null,
      leader: edit?.technicians.filter(item => item.mesa_username == edit?.mesa_username)[0] ? { value: edit?.technicians.filter(item => item.mesa_username == edit?.mesa_username)[0].id, label: edit?.technicians.filter(item => item.mesa_username == edit?.mesa_username)[0].name } : null,
      assistant: edit?.technicians.filter(item => item.mesa_username != edit?.mesa_username).length > 0 ? { value: edit?.technicians.filter(item => item.mesa_username != edit?.mesa_username)[0].id, label: edit?.technicians.filter(item => item.mesa_username != edit?.mesa_username)[0].name } : null,
      starting_point: edit?.starting_point,
    }
  });

  //TODO validar que mesa_username sea el mismo que el del lider
  const onSubmit = async data => {
    data.supervisor_id = showSupervisorField ? data.supervisor.value : userSession.id || null;
    data.users_id = [];
    if (data.leader) {
      data.users_id.push(data.leader.value);
    }
    if (data.assistant) {
      data.users_id.push(data.assistant.value);
    }
    delete data.supervisor;
    delete data.leader;
    delete data.assistant;

    if (primaryFile.length > 0) {
      data.primary_file = primaryFile[0].getFileEncodeBase64String();
    }
    if (secondaryFile.length > 0) {
      data.secondary_file = secondaryFile[0].getFileEncodeBase64String();
    }

    data.cluster_id = clustersGroup.map(item => item.value);
    data.cluster_favourite = clustersFav.filter(item => item.isChecked).map(item => item.cluster_id);
    data.area_id = areaGroup.map(item => item.value);

    delete data.cluster;
    delete data.area;

    axios[submitMethod](submitUrl, data)
      .then(res => {
        mutate('/api/teams/all');
        toastSuccess(edit ? `Cuadrilla modificada exitosamente` : 'Cuadrilla creada exitosamente');
        closeModal();
      })
      .catch(err => {
        const { data } = err.response;


        toastError(data.message);
      })
  };

  const handleClusters = (e) => {
    setClustersGroup(e);
    let clusters = clustersFav;

    e.map(item => {
      if (!clusters.some(cluster => cluster.cluster_id == item.value)){
        clusters.push({cluster_id: item.value, isChecked: false});
      }
    });

    setClustersFav(clusters);
  }

  const handleCheckbox = (e, cluster_id) => {
    let clusters = clustersFav; 

    clusters = clusters.map(item => item.cluster_id == cluster_id ? {cluster_id: cluster_id, isChecked: e.target.checked} : item);
    setClustersFav(clusters);
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));

    setShowSupervisorField(userInfo.roles.some(item => item.name.toUpperCase() == 'ADMINISTRADOR'));

  }, [])



  useEffect(() => {

    if (showSupervisorField) {
      axios.get('/api/supervisor/all')
        .then(res => {
          const supervisors = res.data.users;

          setSupervisorsDataField(supervisors.map(item => ({ value: item.id, label: item.name })))
        })
        .catch(err => toastError('Ocurrió un error al obtener los supervisores'))

    }

    axios.get('/api/technician/all')
      .then(res => {
        const technicians = res.data.users;

        setTechnicianDataField(technicians.map(item => {
          let team = dataTeams.find(team => team.technicians.some(tech => tech.id == item.id));

          return { value: item.id, label: `${item.name} - ${team?.name || 'libre'}` }
        }))
      })
      .catch(err => toastError('Ocurrió un error al obtener los técnicos'))

  }, [showSupervisorField])


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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    try {
      axios.get('/api/cluster/all').then(res => {
        const { data } = res.data;

        setClusterData(data.map(item => ({ value: item.id, label: item.cluster })))
      });

    } catch (e) {
      console.error(e)
    }

    try {
      axios.get('/api/area').then(res => {
        const { data } = res.data;

        setAreaData(data.map(item => ({ value: item.id, label: item.name })))
      });

    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    //console.log(clustersGroup);
    //console.log(areaGroup);
    //console.log(clustersFav);
  }, [clustersGroup, areaGroup, clustersFav])

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh',marginTop: '2vh' }} onKeyDown={handleKeyDown}>

      <Text fontWeight={'bold'} fontSize={'xl'}>
        Datos de la cuadrilla
      </Text>

      <FormControl isInvalid={errors.name}>
        <FormLabel>Nombre *</FormLabel>
        <Input type='text' autoFocus={true} {...register("name", { required: FormValidations.REQUIRED })} />
        {errors.name && <FormErrorMessage>{errors.name?.message}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={errors.google_calendar_id}>
        <FormLabel>Google Calendar ID</FormLabel>
        <Input type='text' {...register("google_calendar_id")} />
        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
      </FormControl>

      <FormControl isInvalid={errors.mesa_username}>
        <FormLabel>Usuario de Mesa *</FormLabel>
        <Input type='text' {...register("mesa_username", { required: FormValidations.REQUIRED })} />
        {errors.mesa_username && <FormErrorMessage>{errors.mesa_username?.message}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={errors.min_tickets_to_do}>
        <FormLabel display={'flex'} gap={'.5vh'} alignItems={'center'}>Minimo de tickets a realizar <Tooltip label={'Representa la cantidad minima de tickets que debe realizar la cuadrilla.'}><span><BsInfoCircle /></span></Tooltip></FormLabel>
        <Input type='number' {...register("min_tickets_to_do", {
          min: {
            value: 1,
            message: "El valor mínimo es 1"
          }
        })} />
        {errors.min_tickets_to_do?.message && <FormErrorMessage>{errors.min_tickets_to_do.message}</FormErrorMessage>}
        <FormHelperText>En caso de no definirlo, por defecto se tomará 5.</FormHelperText>
      </FormControl>

      <FormControl isInvalid={errors.max_tickets_to_do_only_omnichannel}>
        <FormLabel display={'flex'} gap={'.5vh'} alignItems={'center'}>Maximo de tickets a realizar (Solo para OMNICANALIDAD) <Tooltip label={'Representa la cantidad maxima de tickets que puede realizar la cuadrilla para los canales de OMNICANALIDAD'}><span><BsInfoCircle /></span></Tooltip></FormLabel>
        <Input type='number' {...register("max_tickets_to_do_only_omnichannel", {
          min: {
            value: 1,
            message: "El valor mínimo es 1"
          }
        })} />
        {errors.max_tickets_to_do_only_omnichannel && <FormErrorMessage>{errors.max_tickets_to_do_only_omnichannel?.message}</FormErrorMessage>}
        <FormHelperText>En caso de no definirlo, por defecto se tomará 8.</FormHelperText>
      </FormControl>

      {
        showSupervisorField && <FormControl>
          <FormLabel>Supervisor*</FormLabel>

          <Controller
            control={control}
            name="supervisor"
            rules={{ required: true, }}
            render={({ field }) => (
              <Select
                {...field}
                isSearchable={true}
                styles={customSelectStyles}
                options={supervisorsDataField}
                placeholder={'Seleccionar...'}
              />

            )}
          />
        </FormControl>
      }


      <FormControl isInvalid={errors.cluster}>
        <Flex flexDir='row'>
          <FormLabel>Cluster*</FormLabel>
          <Badge colorScheme="green" alignSelf="center" marginBottom={'10px'} rounded={'xl'} fontSize={'10px'} pl={2} pr={2} border={'1px solid green'}>
            Nuevo
          </Badge>
        </Flex>

        <Controller
          control={control}
          name="cluster"
          rules={{ required: !(clustersGroup.length > 0), }}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable={true}
              styles={customSelectStyles}
              options={clusterData}
              defaultValue={clustersGroup}
              placeholder={'Seleccionar...'}
              onChange={(e) => handleClusters(e)}
              isClearable
              isMulti
            />

          )}
        />
        {errors.cluster && <FormErrorMessage>{FormValidations.REQUIRED}</FormErrorMessage>}
      </FormControl>

      
      <FormControl isInvalid={errors.clusterConf}>
        <Flex flexDir='row'>
          <FormLabel>Grupo principal del Cluster</FormLabel>
          <Badge colorScheme="green" alignSelf="center" marginBottom={'10px'} rounded={'xl'} fontSize={'10px'} pl={2} pr={2} mr={3} border={'1px solid green'}>
            Nuevo
          </Badge>
          <Tooltip label={'Tildar el cluster donde desee que la cuadrilla sea la principal a la que se le asigne los tickets.'}><span><BsInfoCircle /></span></Tooltip>
        </Flex>

        <Controller
          control={control}
          name="clusterConf"
          rules={{ required: false, }}
          render={({ field }) => (
            <Flex direction={'column'} wrap={'wrap'}>
              {clustersGroup.length > 0 && 
                clustersGroup.map((cluster, i) => {
                  return (
                    <Checkbox 
                      key={i} 
                      {...field} 
                      value={cluster.value} 
                      isChecked={clustersFav.find(item => item.cluster_id == cluster.value)?.isChecked || false} 
                      onChange={(e) => handleCheckbox(e, cluster.value) }
                    >  
                      <Text fontSize={'14px'}>Cluster {cluster.label}</Text>
                    </Checkbox>
                  )
                })
              }
            </Flex>
          )}
        />
        {errors.clusterConf && <FormErrorMessage>{FormValidations.REQUIRED}</FormErrorMessage>}
      </FormControl>


      <FormControl isInvalid={errors.area}>
      <Flex flexDir='row'>
          <FormLabel>Area*</FormLabel>
          <Badge colorScheme="green" alignSelf="center" marginBottom={'10px'} rounded={'xl'} fontSize={'10px'} pl={2} pr={2} border={'1px solid green'}>
            Nuevo
          </Badge>
        </Flex>

        <Controller
          control={control}
          name="area"
          rules={{ required: !(areaGroup.length > 0), }}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable={true}
              styles={customSelectStyles}
              options={areaData}
              defaultValue={areaGroup}
              placeholder={'Seleccionar...'}
              onChange={(e) => setAreaGroup(e)}
              isClearable
              isMulti
            />

          )}
        />
        {errors.area && (
          <FormErrorMessage>{FormValidations.REQUIRED}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={errors.starting_point}>
      <Flex flexDir='row'>
          <FormLabel>Punto de partida*</FormLabel>
          <Badge colorScheme="green" alignSelf="center" marginBottom={'10px'} rounded={'xl'} fontSize={'10px'} pl={2} pr={2} border={'1px solid green'}>
            Nuevo
          </Badge>
        </Flex>
        <Input
          type='text'
          placeholder='Ej: -34.603722, -58.381592'
          {...register("starting_point", {
            required: false,
            pattern: {
              value: /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/,
              message: FormValidations.GEOLOCATION,
            },
          })}
        />
          <FormHelperText>La geolocalización puede ser extraida desde <Link href='https://www.google.com/maps/' isExternal={true} color={'#0568FF'}>Google Maps</Link>.</FormHelperText>
        {errors.starting_point && (
          <FormErrorMessage>{errors.starting_point?.message}</FormErrorMessage>
        )}
      </FormControl>


      {/**
       * //TODO descomentar cuando se agregue el campo en base de datos
       */}
      {/* <FormControl isInvalid={errors.daily_tickets_minimum}>
        <FormLabel>Cantidad mínima de tickets diario*</FormLabel>
        <Input type='number' {...register("daily_tickets_minimum", { required: FormValidations.REQUIRED })} />
        {errors.daily_tickets_minimum && <FormErrorMessage>{errors.daily_tickets_minimum?.message}</FormErrorMessage>}
      </FormControl> */}

      {/**
       * //TODO en vez de id, debe ser patente para buscar automaticamente el id del dispositivo
       * //! Usar este campo cuando se desarrolle la funcion para traer ID de dispositivo de traccar a traves de la patente u otro identificador
       */}
      {/* <FormControl isInvalid={errors.gps_id}>
        <FormLabel>ID de GPS*</FormLabel>
        <Input type='text' {...register("gps_id", { required: FormValidations.REQUIRED })} />
        {errors.gps_id && <FormErrorMessage>{errors.gps_id?.message}</FormErrorMessage>}
      </FormControl> */}

      <Divider />


      <Text fontWeight={'bold'} fontSize={'xl'}>
        Integrantes
      </Text>

      <FormControl isInvalid={errors.leader}>
        <FormLabel>Líder*</FormLabel>

        <Controller
          control={control}
          name="leader"
          rules={{ required: true, }}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable={true}
              styles={customSelectStyles}
              options={technicianDataField}
              placeholder={'Seleccionar...'}
            />

          )}
        />
      </FormControl>


      {/*
      //! Usar este campo de foto cuando se requiera cargar fotos
      */}
      <FormControl>
        <FormLabel>Foto del líder</FormLabel>
        <FilePond
          files={primaryFile}
          onupdatefiles={setPrimaryFile}
          allowMultiple={false}
          maxFiles={1}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          credits={false}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Auxiliar*</FormLabel>

        <Controller
          control={control}
          name="assistant"
          render={({ field }) => (
            <Select
              {...field}
              isSearchable={true}
              styles={customSelectStyles}
              options={technicianDataField}
              placeholder={'Seleccionar...'}
              isInvalid={true}
              isClearable={true}
            />

          )}
        />
      </FormControl>

      {/* //! Usar este campo de foto cuando se requiera cargar fotos */}
      <FormControl>
        <FormLabel>Foto del auxiliar</FormLabel>
        <FilePond
          files={secondaryFile}
          onupdatefiles={setSecondaryFile}
          allowMultiple={false}
          maxFiles={1}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          credits={false}
        />
      </FormControl>


      <Flex flexDir={'row'} justifyContent={'center'} gap={'0.5vh'}>
        <Button
          type="button"
          width={'100%'}
          fontWeight={'medium'}
          fontSize={'14px'}
          color={'#868383'}
          border={'1px solid #D7D5D5'}
          _hover={{ bg: '#EEEEEE' }}
          bg={'transparent'}
          rounded={'xl'}
          onClick={() => closeModal()}
        >
          Volver
        </Button>
        <Button
                type="submit"
                width={'100%'}
                fontWeight={'medium'}
                fontSize={'14px'}
                color={'white'}
                _hover={{ bg: '#085AFF' }}
                bg={'#0568FF'}
                rounded={'xl'}
        >
          {edit ? `Actualizar cuadrilla` : `Crear cuadrilla`}
        </Button>

      </Flex>



    </form>
  )
}

// Modal para crear o editar un usuario
const ModalForm = ({ isOpen, onClose, edit }) => {
  return (
    <CustomModal icon={<AiOutlineCar />} colorIcon={'blue.100'} title={edit ? `Editar cuadrilla ${edit.name}` : 'Nueva cuadrilla'} description={'Los campos marcados con asteriscos (*) son obligatorios.'} bodyContent={<Form closeModal={onClose} edit={edit} />} onClose={onClose} isOpen={isOpen}/>
  )
}


/**
 * Boton de nueva cuadrilla y modal
 */
const NewRecord = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme='teal'>Nueva cuadrilla</Button>

      <ModalForm isOpen={isOpen} onClose={onClose} />
    </>
  )

}


// Variable para almacenar el nombre de la cuadrilla a eliminar
let teamToDelete;

// Alerta antes de eliminar un registro
const DeleteConfirm = ({ isOpen, onClose }) => {


  function handleDeleteTeam () {
    axios.delete(`/api/teams/${teamToDelete.id}`)
      .then(res => {
        onClose();
        toastSuccess(`La cuadrilla ${teamToDelete.name} ha sido eliminada`)
        mutate(dataUrl);
      })
      .catch(err => {
        console.log(err)
        toastError(`Error al eliminar la cuadrilla ${teamToDelete.name}`)
      })
  }

  return (
    <Modal size={'2xl'} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter='blur(10px)' bg='#C53030A6' />
      <ModalContent>
        <ModalHeader textAlign={'center'}>{`¿Eliminar cuadrilla ${teamToDelete?.name}?`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign={'center'}>
          <Text>
            {`¿Estás seguro de que queres eliminar a la cuadrilla ${teamToDelete?.name}?`}
          </Text>
          <Text fontWeight={'bold'}>
            Esta acción no se puede deshacer.
          </Text>
          <Alert status='error' mt={'4vh'} mb={'2vh'} textAlign={'start'} rounded={'lg'}>
            <AlertIcon />
            <AlertDescription fontWeight={'bold'}>{`Esta acción provocara que ${teamToDelete?.technicians.map(item => item.name).toString().replace(',', ' y ')} se queden sin cuadrilla.`}</AlertDescription>
          </Alert>

        </ModalBody>

        <ModalFooter as={Flex} flexDirection={'row'} gap={'1vh'}>
          <Button variant='ghost' w={'100%'} onClick={onClose}>Cancelar</Button>
          <Button colorScheme='red' mr={3} w={'100%'} onClick={() => handleDeleteTeam()}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Componente principal
export default function Index () {
  const [userInfo, setUserInfo] = useState();
  const [editInfo, setEditInfo] = useState()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    userSession = user;
    setUserInfo(user);
  }, [])

  let dataUrl = null;

  if (userInfo) {
    dataUrl = '/api/teams/all';
  }

  const { data, error, isLoading } = useSWR(dataUrl, fetcher);

  if (data?.error) toastError('Ocurrió un error al intentar mostrar las cuadrillas.');
  else dataTeams = data;


  // Variables para manejo de modal cuando se edita un registro
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Funcion para eliminar un registro
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();


  const columns = [
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
          <MenuItem borderRadius={'0.5vh !important'} bg={'red.500'} color={'white'} fontWeight={'bold'} onClick={() => { onOpenDelete(); teamToDelete = row }}><DeleteIcon color={'white'} mr={'1vh'} />Eliminar</MenuItem>
        </MenuList>
      </Menu>),
      sortable: true,
      width: '7vh',
      compact: true
    },

    {
      name: 'Nombre',
      selector: row => row.name,
      sortable: true,
      compact: true
    },
    {
      name: 'Integrantes',
      selector: row => {


        if (row.technicians.length == 0) {
          return <></>;
        }

        return (
          <Wrap justify='center'>
            {
              row.technicians.map(item => {
                if (!item.photo) {
                  const defaultPic = createAvatar(initials, {
                    size: 64,
                    seed: item.name
                  }).toDataUriSync();
                  return <WrapItem key={item.name}>
                    <Tooltip label={item.name}>
                      <Avatar size={'lg'} name={item.name} src={defaultPic} />
                    </Tooltip>
                  </WrapItem>
                }
                else {
                  return <WrapItem key={item.name}>
                    <Tooltip label={item.name}>
                      <Avatar size={'lg'} name={item.name} src={`data:image/jpeg;base64,${item.photo}`} />
                    </Tooltip>
                  </WrapItem>
                }
              })
            }
          </Wrap>
        )
      }
    },
    {
      name: 'Usuario de Mesa',
      selector: row => row.mesa_username,
      sortable: true
    },
    {
      name: 'Supervisor',
      selector: row => row.supervisor,
      cell: row => <Text align={'center'}>{row.supervisor ? row.supervisor : '-'}</Text>,
      sortable: true
    },
    {
      name: 'Áreas',
      selector: row => row.areas.map(item => item.name).join(', '),
      sortable: true
    },
    {
      name: 'Cluster',
      selector: row => row.clusters.length > 0? row.clusters.map(item => item.name).join(', ') : '-',
      cell: row => row.clusters.length > 0? row.clusters.map(item => item.name).join(', ') : '-',
      sortable: true,
      compact: true
    },
    {
      name: '1° en Cluster',
      selector: row => row.clusters,
      cell: row => row.clusters.filter(c => c.favourite_group == row.id).map(item => item.name).join(', '),
      sortable: true,
      compact: true
    },
    {
      name: <Text align={'center'}>Tickets diarios mínimo</Text>,
      selector: row => row.min_tickets_to_do ? row.min_tickets_to_do : 'No definido (por defecto 5)',
      sortable: true,
      compact: true
    },
    {
      name: <Text align={'center'}>Tickets maximos para OMNICANALIDAD</Text>,
      selector: row => row.max_tickets_to_do_only_omnichannel ? row.max_tickets_to_do_only_omnichannel : 'No definido (por defecto 8)',
      sortable: true,
      compact: true
    },
    {
      name: <Text align={'center'}>Punto de partida</Text>,
      selector: row => row.starting_point ? row.starting_point : '-',
      cell: row => <Text align={'center'}>{row.starting_point ? row.starting_point : '-'}</Text>,
      sortable: true,
      compact: true
    },
    {
      name: <Text align={'center'}>ID de Traccar</Text>,
      selector: row => row.traccar_device_id,
      cell: row => <Text align={'center'}>{row.traccar_device_id ? row.traccar_device_id : '-'}</Text>,
      sortable: true,
      compact: true
    },
  ];

  return (
    <Container maxW='190vh' pt={'5vh'}>
      <Toaster />
      <ModalForm isOpen={isOpen} onClose={onClose} edit={editInfo} />
      <DeleteConfirm isOpen={isOpenDelete} onOpen={onOpenDelete} onClose={onCloseDelete} />
      {data && userInfo &&
        <Table
          columns={columns}
          data={userInfo.roles.some(item => item.name.toUpperCase() == 'ADMINISTRADOR') ? data : data.filter(t => t.supervisor_id == userInfo.id)}
          isLoading={isLoading}
          title={'Cuadrillas'}
          containerWidth={'500vh'}
          customButtonHeader={<NewRecord />}
          error={data?.error} />
      }
    </Container>
  )
}
