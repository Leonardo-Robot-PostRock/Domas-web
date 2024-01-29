import { Container, Box, Flex, Text, useColorModeValue, useDisclosure, Icon, Button, Select, SimpleGrid, Radio, RadioGroup, Input, Stack, Checkbox } from "@chakra-ui/react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay } from '@chakra-ui/react';
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as MdIcon from 'react-icons/md'
import dayjs from "dayjs";
import axios from "axios";
import fetcher from "@/utils/Fetcher";
import useSWR, { mutate } from "swr";


const Index = () => {

    const [day, setDay] = useState(dayjs(dayjs().date(1)));
    const [monthA, setMonthA] = useState();
    const [monthB, setMonthB] = useState();
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState();
    const [teamOffDays, setTeamOffDays] = useState();
    const [alwaysActive, setAlwaysActive] = useState(false);
    
    const { data } = useSWR(`/api/calendar`, fetcher);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const MonthGrid = (day, teamOffDays) => {
        let d = day, checked = [], z = day.daysInMonth(), j = 0;

        for (let i = 0; i < z; i++) {         
            if (i == 0 && (d.$W - 1) > 0){
                for (let j = 0; j < (d.$W - 1); j++) {
                    checked.unshift({day: '', checked: '', color: '#EDF2F7'});
                }
            }
            else if(i == 0 && d.$W == 0){
                for (let j = 0; j < 6; j++) {
                    checked.unshift({day: '', checked: '', color: '#EDF2F7'});
                }
            }

            if (teamOffDays[j] && d.format('DD/MM') == dayjs(teamOffDays[j].date).format('DD/MM')){                
                checked.push({
                    day: dayjs(d),
                    checked: true, 
                    color: teamOffDays[j].cause == 'DIA_LIBRE'? 'orange.300' : teamOffDays[j].cause == 'LICENCIA'? 'green.300' : 'red.400', 
                    cause: teamOffDays[j].cause, 
                    observation: teamOffDays[j].observation,
                    id: teamOffDays[j].id
                });
                j++;
            }
            else {
                checked.push({day: dayjs(d), checked: false, color: 'white'});
            }
            
            if (i == (z-1) && (d.$W - 1) < 7) {
                for (let j = (d.$W - 1); j < 6; j++) {
                    checked.push({day: '', checked: '', color: '#EDF2F7'});
                }
            }

            d = dayjs(d).add(1, 'day');
        }

        return {checked: checked};
    };

    const setCalendar = (e) => {
        //console.log(teams[e.target.value]);
        setMonthA(null);
        setMonthB(null);

        let position = e.target.value;
        let off = {current: [], next: []};

        if (teams[position].Team_Days_Off.length > 0) {

            teams[position].Team_Days_Off.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1);

            teams[position].Team_Days_Off.forEach(item => {
                item.date = dayjs(item.date);
                
                if (dayjs(item.date).month() == dayjs().month()){
                    off.current.push(item);
                }
                else if (dayjs(item.date).month() == (dayjs().month() + 1)){
                    off.next.push(item);
                }
                else if (dayjs(item.date).month() == 0){
                    off.next.push(item);
                }
            });
        }
        setTeamOffDays(off);
        setTeam(teams[position]);
        setAlwaysActive(teams[position].always_active);
    };

    const handleOnChange = (e) => {
        setAlwaysActive(e.target.checked);
        onOpen();
    }

    const setTeamAlwaysActive = () => {

        axios.patch(`/api/calendar`, {team_id: team.id, alwaysActive: alwaysActive})
        .then(res => {
            if(res.status == 200)
                toast.success(res.data.message, {
                    duration: 4000,
                    position: 'top-center',
                });

            mutate(`/api/calendar`);
        })
        .catch(error => {
            toast.error(error.response.data, {
                duration: 4000,
                position: 'top-center',
            });
            //console.log(error);
            setAlwaysActive(!alwaysActive);
        });

        onClose();
    }
    
    useEffect(() => {     
        //console.log(data);   
        setTeams(data?.teams);
    }, [data])

    useEffect(() => {
        if (teamOffDays){
            //console.log(teamOffDays);

            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            let calculateMonth = MonthGrid(day, teamOffDays.current);
            setMonthA({ month: monthNames[day.month()], grid: calculateMonth.checked });

            let calculateMonthBName = day.month() + 1 == 12? 0 : day.month() + 1;
            calculateMonth = MonthGrid(dayjs(day).add(1, 'month'), teamOffDays.next);
            setMonthB({ month: monthNames[calculateMonthBName], grid: calculateMonth.checked });
        }

        mutate(`/api/calendar`)

    }, [day, teamOffDays]);

    
    
    return (        
            <Container my={5} textAlign={'center'} maxW='90%' backgroundColor={useColorModeValue('white', '#191d32')} borderRadius={10} border={`1px solid ${useColorModeValue('#E3EAF2', '#101219')}`}> 
                <Toaster />
                
                <Text mx={'auto'} my={8} w={'50%'} fontSize={'32px'}> Calendario de Cuadrillas </Text>                   
                    {teams?
                        <Flex justifyContent={'space-evenly'} alignItems='center' my={4}>                            
                            <Select fontWeight={'medium'} w={{base: '80%', md: '50%', lg: '20%'}} placeholder="Seleccione un equipo" size='md' borderColor={'twitter.700'} onChange={setCalendar} >
                                {teams.map((team, i) => {
                                    return (<option key={i} value={i}> {team.name} </option>)
                                })}
                            </Select>

                            {team && <Checkbox isChecked={alwaysActive} onChange={handleOnChange}>Cuadrilla siempre activa </Checkbox>}
                        </Flex>
                        :
                        null
                    }
                    
                    {monthA && !alwaysActive &&
                        <Box>
                            <Text mx={'auto'} my={2} w={'30%'} fontSize={'24px'}> {monthA.month} </Text>
                            <Calendar month={monthA.grid} team={team} />
                        </Box>                        
                    }              

                    {monthB && !alwaysActive &&
                        <Box>
                            <Text mx={'auto'} my={2} w={'30%'} fontSize={'24px'}> {monthB.month} </Text> 
                            <Calendar month={monthB.grid} team={team} />
                        </Box>
                    } 

                    <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} my={2} gap={2} bg={'transparent'} placeItems={'center'}>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}> 
                            <Icon as={MdIcon.MdFiberManualRecord} color={'orange.300'} style={{ display: 'inline' }}/>
                            <Text fontSize={'18px'}> Días Libres </Text>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Icon as={MdIcon.MdFiberManualRecord} color='green.300' style={{ display: 'inline' }}/>
                            <Text fontSize={'18px'}> Vacaciones </Text>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Icon as={MdIcon.MdFiberManualRecord} color={'red.400'} style={{ display: 'inline' }}/>
                            <Text fontSize={'18px'}> Mantenimiento del vehículo </Text>
                        </Box>
                    </Box>

                    {   team &&
                        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
                            <ModalOverlay bg='blackAlpha.100' backdropFilter='blur(10px) hue-rotate(25deg)' />
                            <ModalContent>
                            <ModalHeader>Dias Libres</ModalHeader>
                            {alwaysActive?
                                <ModalBody>
                                    <Text>Desactivar días libres para la cuadrilla {team.name}? </Text>
                                    <Text fontSize={14} mt={3}>Esta acción borrara todas las fechas guardadas para esta cuadrilla a partir de hoy.</Text>
                                </ModalBody>
                                :
                                <ModalBody>
                                    <Text>Activar días libres para la cuadrilla {team.name}? </Text>
                                </ModalBody>
                            }

                            <ModalFooter>
                                <Button colorScheme='red' variant={'outline'} mr={3} onClick={() => {setAlwaysActive(!alwaysActive); onClose()}}>
                                    Cerrar
                                </Button>
                                <Button colorScheme='green' onClick={setTeamAlwaysActive}>{alwaysActive? 'Desactivar' : 'Activar'}</Button>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>
                    }
            </Container>
    )
    
}


const Calendar = ({month, team}) => {   
   
    return(
        
        <Container borderRadius={4} mb={4} py={1} maxW='90%'>
            <Box mx={'auto'} maxW={'1200px'} bg={'#EDF2F7'} borderRadius={6}>       
                {   month &&  
                    <SimpleGrid columns={7} spacingY='10px' h={'480px'} justifyItems={'center'} py={4} >
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> L </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> M </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> X </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> J </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> V </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> S </Box>
                        <Box w='85%' bg={'facebook.400'} color={'white'} height='32px' borderRadius={6}> D </Box>
                        {month.map((item, i) => {
                            return(
                                item.day?
                                <Day key={i} item={item} team={team} />
                                : 
                                <Box key={i}/>              
                            )
                        })}
                        
                    </SimpleGrid>                       
                }             
            </Box>
        </Container>         

    )

}

const Day = ({ item, team }) => {
    const [data, setData] = useState();
    const [cause, setCause] = useState(null);
    const [observation, setObservation] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOnOpen = () => {
        setCause(data? data.cause : null);
        setObservation(data?.observation? data.observation : '');
        onOpen();
    }

    const saveChanges = () => { 
        if (!data) {
            toast.error('Ocurrio un error, recargue la pagina por favor.', {
                duration: 4000,
                position: 'top-center',
            });

            onClose();
            return false;
        }
        
        let reqData = {
            team_id: team.id,
            date: dayjs(data.day).hour(12).minute(0).format('YYYY-MM-DD HH:mm:ss'),
            cause: cause,
            observation: observation
        };

        if (data.color == 'white') {
            axios.post('/api/calendar', reqData)
            .then(res => {
                if(res.status == 200){
                    toast.success(res.data.message, {
                        duration: 4000,
                        position: 'top-center',
                    })
                }

                let check = {
                    day: data.day,
                    checked: true, 
                    color: cause == 'DIA_LIBRE'? 'orange.300' : cause == 'LICENCIA'? 'green.300' : 'red.400', 
                    cause: cause, 
                    observation: observation
                };
                setData(check);
            })
            .catch(error => {
                toast.error(error.response.data, {
                    duration: 4000,
                    position: 'top-center',
                });
                //console.log(error);
            })
        }
        else {
            reqData.id = data.id;

            axios.put('/api/calendar', reqData)
            .then(res => {
                //console.log(res);
                if(res.status == 200){
                    toast.success(res.data.message, {
                        duration: 4000,
                        position: 'top-center',
                    })
                }

                let check = {
                    day: data.day,
                    checked: true, 
                    color: cause == 'DIA_LIBRE'? 'orange.300' : cause == 'LICENCIA'? 'green.300' : 'red.400', 
                    cause: cause, 
                    observation: observation
                };
                setData(check);
            })
            .catch(error => {
                //console.log(error);
                toast.error(error.response.data, {
                    duration: 4000,
                    position: 'top-center',
                });
            })
        }

        onClose();
    }

    const deleteDayOff = () => {
        if (!data || !data?.id) {
            toast.error('Ocurrio un error, recargue la pagina por favor.', {
                duration: 4000,
                position: 'top-center',
            });

            onClose();
            return false;
        }

        axios.delete(`/api/calendar?date_id=${data.id}`)
            .then(res => {
                //console.log(res);
                if(res.status == 200){
                    toast.success(res.data.message, {
                        duration: 4000,
                        position: 'top-center',
                    })
                }

                let check = { day: data.day, checked: false, color: 'white' };
                setData(check);
            })
            .catch(error => {
                //console.log(error);
                toast.error(error.response.data, {
                    duration: 4000,
                    position: 'top-center',
                });
            });

        onClose();
    }

    useEffect(() => {
        //console.log(data);
        setData(item);
    }, []);

    useEffect(() => {
        //console.log(data);
    }, [data]);
    
    return (
        <Box w={'100%'} >
            {data &&
                <Button onClick={() => { handleOnOpen() }} bg={data.color} w={'75%'} my={'10%'} > 
                    {dayjs(data.day).format('DD/MM')} 
                </Button> 
            }                                       

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Día</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody fontSize={18}>
                        <Text my={3} fontWeight={'bold'} > Causa </Text>
                        <RadioGroup onChange={setCause} value={cause}>
                            <Stack>
                                <Radio value='DIA_LIBRE'>Día Libre</Radio>
                                <Radio value='MANTENIMIENTO'>Mantenimiento del vehículo</Radio>
                                <Radio value='LICENCIA'>Vacaciones</Radio>
                            </Stack>
                        </RadioGroup>    
                        <Text my={3} fontWeight={'bold'} > Observación </Text>
                        <Input value={observation} onChange={(e) => setObservation(e.target.value)}/>
                    </ModalBody>
                        
                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Cerrar
                        </Button>
                        <Button colorScheme='green' mr={3} onClick={() => saveChanges()}>
                            Guardar
                        </Button>
                        <Button colorScheme='red' onClick={deleteDayOff}>
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box> 
    )
}


export default Index;