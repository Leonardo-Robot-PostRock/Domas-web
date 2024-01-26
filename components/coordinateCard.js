import {
  Container,
  Box,
  Flex,
  Link,
  Tooltip,
  Text,
  useColorModeValue,
  Divider,
  Button,
  Select,
  Center,
  Textarea,
  Checkbox,
  List,
  ListItem,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import dayjs from 'dayjs';

import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Mendoza');

const CoordinateCard = ({ data, turns, toast, teams }) => {
  const { customer, id, order_id, Ticket_history, cluster, recurrent } = data;
  let phones = [customer.phone, customer.phone2, customer.phone3, customer.phone4];
  phones = phones.filter((p) => {
    if (p) return `${p}, `;
  });

  const color = useColorModeValue('#273D54', '#AAAFC5');
  const [date, setDate] = useState(new Date(new Date().getTime() + 86400000));
  const [day, setDay] = useState(null);
  const [shift, setShift] = useState(null);
  const [submitButton, setSubmitButton] = useState({
    disabled: false,
    text: 'Coordinar visita',
  });
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState();
  const [closeButton, setCloseButton] = useState({
    disabled: false,
    text: 'Cerrar Ticket',
  });
  const [toastSuccess, setToastSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      appointment_date: '',
      visiting_hours: '',
    },
  });

  const [checked, setChecked] = useState({
    status: false,
    comment: '',
  });
  const [closeTk, setCloseTk] = useState({
    alert: 'info',
  });
  const [closeComment, setCloseComment] = useState({
    comment: '',
  });

  const setShiftOptions = (selectedValue) => {
    let option = parseInt(selectedValue.target.selectedOptions[0].value);

    if (option >= 0) {
      let shift = turns[option];
      let x = [];

      if (shift.first_turn) {
        x.push({ label: 'Primer Turno', value: 'first_turn' });
      }
      if (shift.morning > 0) {
        x.push({ label: 'Mañana', value: 'morning' });
      }
      if (shift.afternoon > 0) {
        x.push({ label: 'Tarde', value: 'afternoon' });
      }
      if (shift.all_day) {
        x.push({ label: 'Todo el día', value: 'all_day' });
      }

      setDay(shift.day);
      setShift(x);
    } else {
      setDay(null);
      setShift(null);
    }
  };

  let handleCloseInputChange = (e) => {
    let inputValue = e.target.value;
    setCloseComment({ comment: inputValue });
  };

  let handleCheckedInputChange = (e) => {
    let inputValue = e.target.value;
    setChecked({ status: checked.status, comment: inputValue });
  };

  const onSubmit = (formData) => {
    toast.promise(
      PutReq(formData),
      {
        loading: 'Coordinando visita...',
        success: (data) => `${data.message}`,
        error: (err) => `${err.message}`,
      },
      { style: { minWidth: '450px' }, success: { duration: 6000 } }
    );
  };

  const PutReq = async (formData) => {
    //console.log(day);
    setSubmitButton({ disabled: true, text: 'Coordinando visita...' });
    formData.ticket_id = id;
    formData.ticket_status = 'COORDINADO';
    formData.appointment_date = day;
    formData.priority = false;

    if (formData.visiting_hours == 'first_turn') {
      formData.priority = true;
      formData.visiting_hours = 'morning';
    }
    //formData.order_id = order_id;

    //console.log(formData);

    return await axios
      .put('/api/ticket/update', formData)
      .then((res) => {
        setIsSubmitSuccessful(new Date());
        //console.log(res);
        if (res.status == 200) {
          //console.log(res.status);
          setToastSuccess(true);
        } else {
          //console.log('Status mayor a 200');
          setToastSuccess(false);
        }

        return res.data;
      })
      .catch((err) => {
        //console.log(err);
        setToastSuccess(false);
        return err.response.data;
      })
      .finally((value) => {
        setSubmitButton({ disabled: true, text: 'Visita Coordinada' });
        setCloseButton({ disabled: true, text: 'Cerrar Ticket' });
      });
  };

  const onProgramCall = () => {
    toast.promise(
      programCall(),
      {
        loading: 'Creando recordatorio...',
        success: (data) => `${data.message}`,
        error: (err) => `${err.message}`,
      },
      { style: { minWidth: '450px' }, success: { duration: 6000, icon: '' } }
    );
  };

  const programCall = async () => {
    let data = {
      ticket_status: 'PROGRAMADO',
      program_date: dayjs(date).hour(12).format('YYYY-MM-DDTHH:mm:ssZ'),
      ticket_id: id,
      //order_id: order_id
    };

    return await axios
      .post('api/ticket/update', data)
      .then((res) => {
        //console.log(res.data);
        setIsSubmitSuccessful(new Date());
        setSubmitButton({ disabled: true, text: 'Llamada Programada' });
        setCloseButton({ disabled: true, text: 'Cerrar Ticket' });

        if (res.status == 200) {
          //console.log(res.status);
          setToastSuccess(true);
        } else {
          //console.log('Status mayor a 200');
          setToastSuccess(false);
        }

        return res.data;
      })
      .catch((err) => {
        //console.log(err.response);

        setToastSuccess(false);

        return err.response.data;
      });
  };

  const onCloseTicket = () => {
    if (closeComment.comment != '') {
      setCloseTk({ alert: 'success' });

      let formData = {
        ticket_status: 'NO_COORDINADO',
        ticket_id: id,
        comment: closeComment.comment,
        create_ticket: checked.status,
        create_ticket_comment: checked.comment,
        //order_id: order_id,
      };

      toast.promise(
        closeTicket(formData),
        {
          loading: 'Cerrando Ticket...',
          success: (data) => `${data.message}`,
          error: (err) => `${err.message}`,
        },
        { style: { minWidth: '450px' }, success: { duration: 6000 } }
      );
    } else {
      setCloseTk({ alert: 'error' });
    }
  };

  const closeTicket = async (formData) => {
    //console.log('Se cierra tk. Checked: ' + check);

    return await axios
      .post('/api/ticket/update', formData)
      .then((res) => {
        setSubmitButton({ disabled: true, text: 'Coordinar Visita' });
        setCloseButton({ disabled: true, text: 'Ticket Cerrado' });
        setCloseTk({ alert: 'info' });

        if (res.status == 200) {
          //console.log(res.status);
          setToastSuccess(true);
        } else {
          //console.log('Status mayor a 200');
          setToastSuccess(false);
        }

        return res.data;
      })
      .catch((err) => {
        //console.log(err.response);
        setToastSuccess(false);
        return err.response.data;
      });
  };

  useEffect(() => {
    reset({
      appointment_date: '',
      visiting_hours: '',
    });
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (toastSuccess) {
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    }
  }, [toastSuccess]);

  return (
    <Box
      backgroundColor={useColorModeValue('white', '#191d32')}
      borderRadius={20}
      border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')} `}
    >
      <Tabs isFitted variant="solid-rounded" colorScheme={'telegram'}>
        <TabList>
          <Tab fontWeight={'semibold'} textAlign={'center'}>
            Coordinar
          </Tab>
          <Tab fontWeight={'semibold'} textAlign={'center'}>
            Cerrar Ticket
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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

            <Tooltip label={`Cluster`}>
              <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                <MdIcon.MdBubbleChart style={{ display: 'inline' }} />
                <Text m={0} pl={2} color={color} fontSize={'13px'}>
                  CLUSTER {cluster}
                </Text>
              </Box>
            </Tooltip>

            {Ticket_history.length > 0 && Ticket_history[0] != null && (
              <Tooltip label={`Comentario dejado en el ticket`}>
                <Flex direction={'column'}>
                  <Accordion allowToggle>
                    <AccordionItem>
                      <AccordionButton pt={1} pb={0}>
                        <Box flex="1" justifyContent={'center'}>
                          <Text m={0} pl={2} color={color} fontSize={'13px'}>
                            HISTORIAL
                          </Text>
                          <AiIcon.AiOutlineCaretDown style={{ display: 'inline' }} />
                        </Box>
                      </AccordionButton>
                      <AccordionPanel px={1} maxH={'20vh'} overflow={'auto'}>
                        <List>
                          {Ticket_history.map((comment, i) => {
                            return (
                              <ListItem key={i}>
                                <Box display={'flex'} flexDirection={'row'}>
                                  <Box w={'20%'}>
                                    <Text
                                      m={0}
                                      pl={2}
                                      color={
                                        comment.description.toUpperCase().includes('RECOORDINACIÓN') ||
                                        comment.description.toUpperCase().includes('RECOORDINACION')
                                          ? '#e60000'
                                          : color
                                      }
                                      fontSize={'12px'}
                                    >
                                      {dayjs(comment.createdAt).format('DD-MM-YY HH:mm')}
                                    </Text>
                                  </Box>
                                  <Box w={'80%'}>
                                    <Text
                                      m={0}
                                      pl={2}
                                      color={
                                        comment.description.toUpperCase().includes('RECOORDINACIÓN') ||
                                        comment.description.toUpperCase().includes('RECOORDINACION')
                                          ? '#e60000'
                                          : color
                                      }
                                      fontSize={'12px'}
                                    >
                                      {comment.description.toUpperCase()}
                                    </Text>
                                  </Box>
                                </Box>
                              </ListItem>
                            );
                          })}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                    <MdIcon.MdOutlineError
                      style={{ display: 'inline' }}
                      color={
                        Ticket_history.filter((t) => t.ticket_status == 'RECOORDINAR').length > 0 ? '#e60000' : color
                      }
                    />
                    <Text
                      m={0}
                      pl={2}
                      fontSize={'13px'}
                      color={
                        Ticket_history.filter((t) => t.ticket_status == 'RECOORDINAR').length > 0 ? '#e60000' : color
                      }
                    >
                      RECOORDINACIONES:{' '}
                      {
                        Ticket_history.filter(
                          (t) =>
                            t.description.toUpperCase().includes('RECOORDINACIÓN') ||
                            t.description.toUpperCase().includes('RECOORDINACION')
                        ).length
                      }
                    </Text>
                  </Box>
                </Flex>
              </Tooltip>
            )}

            {recurrent != null && recurrent >= 1 && (
              <Tooltip
                label={`Más de un ticket del área técnica en 6 meses. Enlace a Mesa al hacer click sobre la cantidad de tickets.`}
              >
                <Box display={'flex'} mt={3} gap={1} bg={'transparent'} placeItems={'center'}>
                  <MdIcon.MdOutlineError style={{ display: 'inline' }} color={'#e60000'} />
                  <Text m={0} pl={2} color={'#e60000'} fontSize={'13px'}>
                    CLIENTE REITERADO (
                    <Link href={`http://mesa.westnet.com.ar/ticket#codigo_cliente.${customer.code}`} isExternal>
                      {recurrent} tickets
                    </Link>
                    )
                  </Text>
                </Box>
              </Tooltip>
            )}

            <Center my={6}>
              <Tooltip hasArrow label="Programar recordatorio para llamar en otra fecha">
                <span>
                  <AiIcon.AiOutlineQuestionCircle style={{ display: 'inline', marginLeft: '5px' }} size={17} />
                </span>
              </Tooltip>
              <Box w={'25%'} mx={3}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date(new Date().getTime() + 86400000)}
                  selected={date}
                  onChange={(d) => setDate(d)}
                />
              </Box>
              <Button
                colorScheme={'blue'}
                width="30%"
                fontSize={'13px'}
                size="sm"
                fontWeight={'medium'}
                disabled={submitButton.disabled}
                onClick={onProgramCall}
              >
                Programar llamado
              </Button>
            </Center>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt={5} isInvalid={errors.appointment_date}>
                <FormLabel fontWeight={'normal'} htmlFor="appointment_date">
                  Día de Visita
                </FormLabel>
                {turns != null ? (
                  turns.error ? (
                    <Text m={0} pl={2} color={color}>
                      No hay turnos disponibles
                    </Text>
                  ) : (
                    <Select
                      fontWeight={'light'}
                      placeholder="Seleccione una fecha"
                      size="sm"
                      {...register('appointment_date', { required: true })}
                      onChange={setShiftOptions}
                    >
                      {turns.map((turn, i) => {
                        return (
                          <option key={i} value={i}>
                            {' '}
                            {dayjs(turn.day).format('DD/MM/YYYY')}{' '}
                          </option>
                        );
                      })}
                    </Select>
                  )
                ) : (
                  <Text m={0} pl={2} color={color}>
                    Cargando fechas disponibles...
                  </Text>
                )}

                {errors.appointment_date && <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>}
              </FormControl>

              <FormControl mt={5} isInvalid={errors.visiting_hours}>
                <FormLabel fontWeight={'normal'} htmlFor="visiting_hours">
                  Turno de Visita
                </FormLabel>
                {shift != null ? (
                  <Select
                    fontWeight={'light'}
                    placeholder="Seleccione un turno"
                    size="sm"
                    {...register('visiting_hours', { required: true })}
                  >
                    {shift.map((x, i) => {
                      return (
                        <option key={i} value={x.value}>
                          {' '}
                          {x.label}{' '}
                        </option>
                      );
                    })}
                  </Select>
                ) : (
                  <Select placeholder="Seleccione un turno" size="sm" disabled={true}></Select>
                )}
                {errors.visiting_hours && <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>}
              </FormControl>

              <FormControl mt={7}>
                <Flex align="center" justify="center">
                  <Button
                    type="submit"
                    colorScheme={'green'}
                    disabled={submitButton.disabled}
                    width="50%"
                    fontSize={'15px'}
                    fontWeight={'semibold'}
                  >
                    {submitButton.text}
                  </Button>
                </Flex>
              </FormControl>
            </form>
          </TabPanel>
          <TabPanel>
            <Text fontSize={'14px'} fontWeight={'medium'} mt={2}>
              Esta por cerrar el ticket #{id} como cerrado (no resuelto).
            </Text>
            <Divider my={4} />
            <Text fontSize={'14px'} fontWeight={'medium'}>
              Razón por la que se cierra ticket:
            </Text>
            <Textarea size="sm" placeholder="Ejemplo: Cliente no desa la visita." onChange={handleCloseInputChange} />
            <Alert status={closeTk.alert} py={2}>
              <AlertIcon />
              <AlertTitle fontWeight={'medium'} fontSize={'12px'}>
                {' '}
                Se debe incluir un comentario para actualizar en Mesa{' '}
              </AlertTitle>
            </Alert>
            <Divider my={4} />

            <Checkbox
              isChecked={checked.status}
              onChange={(e) => setChecked({ status: e.target.checked, comment: '' }, !checked.status)}
            >
              <Text fontSize={'13px'}>Crear ticket de Datos de Contacto Erróneo</Text>
            </Checkbox>
            <Textarea
              isDisabled={!checked.status}
              size="sm"
              placeholder="Ejemplo: Actualizar datos de contacto."
              onChange={handleCheckedInputChange}
            />

            <Flex align="center" justify="center">
              <Button
                colorScheme={'red'}
                disabled={closeButton.disabled}
                width="50%"
                mx={'auto'}
                fontSize={'15px'}
                fontWeight={'semibold'}
                mt={6}
                onClick={() => {
                  onCloseTicket();
                }}
              >
                {closeButton.text}
              </Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {teams && <ChangeTeamModal teams={teams} ticketID={id} toast={toast} />}
    </Box>
  );
};

const ChangeTeamModal = ({ teams, ticketID, toast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();

  const onChangeTeam = (data) => {
    //console.log(data);
    const { teamId } = data;

    axios
      .put(`/api/team/changeTeam?ticket_id=${ticketID}`, {
        team_id: teamId,
      })
      .then((res) => {
        toast.success('Cambio de equipo con éxito!', {
          position: 'top-center',
          duration: 2000,
        });

        onClose();

        setTimeout(() => {
          window.location.reload(true);
        }, 1500);
      })
      .catch((err) => {
        toast.error('Ocurrio un error al tratar de cambiar de equipo', {
          position: 'top-center',
          duration: 3000,
        });
      });
  };

  return (
    <Container>
      <Button
        mt={1}
        mb={2}
        colorScheme="black"
        variant="link"
        w={'100%'}
        onClick={onOpen}
        fontWeight={'bold'}
        fontSize={'12px'}
      >
        {'Cambiar de Equipo'}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cambiar equipo Asignado</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form onSubmit={handleSubmit(onChangeTeam)}>
              <FormControl>
                <FormLabel>Equipo</FormLabel>

                <Select
                  fontWeight={'light'}
                  placeholder="Seleccione un equipo"
                  size="sm"
                  {...register('teamId', { required: true })}
                >
                  {teams.map((team, i) => {
                    return (
                      <option key={i} value={team.id}>
                        {' '}
                        {team.name}{' '}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <Flex mt={5} justifyContent={'flex-end'}>
                <Button mr={3} onClick={onClose}>
                  {' '}
                  Cancelar{' '}
                </Button>
                <Button colorScheme="red" mr={3} type="submit">
                  {' '}
                  Actualizar{' '}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CoordinateCard;
