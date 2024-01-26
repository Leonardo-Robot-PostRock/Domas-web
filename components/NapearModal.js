import {
  Alert,
  Box,
  Checkbox,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slide,
  Text,
  VStack,
  useDisclosure,
  Radio,
  RadioGroup,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSettings } from 'react-icons/fi';
import { CustomModal } from './CustomModal';
import Select from 'react-select';
import { filterObjectByProperties } from '@/utils/filterObjectByProperties';
import { SuccessButton } from './Buttons';
import { parse } from 'filepond';

function FormularioWanMode({ modalOnClose, readOnly, handleError }) {
  const [wanModeChecked, setWanModeChecked] = useState(false);
  const [dataIsUploading, setDataIsUploading] = useState(false);
  const { isOpen: isOpenPPPoE, onToggle: onTogglePPPoE } = useDisclosure();
  const { isOpen: isOpenStaticIP, onToggle: onToggleStaticIP } = useDisclosure();
  const { isOpen: isOpenSuccessButton, onToggle: onToggleSuccessButton } = useDisclosure();
  const [buttonPromise, setButtonPromise] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm();

  const watchModoWan = watch('mode');

  const onSubmit = async (data) => {
    switch (data.mode) {
      case 'PPPoE':
        data = filterObjectByProperties(data, ['mode', 'username', 'password']);
        break;

      case 'StaticIP':
        data = filterObjectByProperties(data, ['mode', 'ip_address', 'subnet_mask', 'default_gateway', 'dns1', 'dns2']);
        break;
      default:
        data = filterObjectByProperties(data, ['mode']);
        break;
    }

    const promise = axios.put('/api/ticket/installation', data);
    setButtonPromise(promise);

    promise
      .then((response) => {
        setIsSubmitted(true);

        const napearInfo = JSON.parse(localStorage.getItem('napear'));
        napearInfo.wan_mode = data;

        localStorage.setItem('napear', JSON.stringify(napearInfo));

        setTimeout(() => {
          onToggleSuccessButton();
        }, 4000);
      })
      .catch((error) => {
        handleError();
      });
  };

  const handleModoWANChange = (value) => {
    setTimeout(() => {
      if (value == 'PPPoE' || (value == 'StaticIP' && isOpenPPPoE) || (value == 'DHCP' && isOpenPPPoE)) {
        onTogglePPPoE();
      }
      if (value == 'StaticIP' || (value == 'PPPoE' && isOpenStaticIP) || (value == 'DHCP' && isOpenStaticIP)) {
        onToggleStaticIP();
      }
    }, 50);

    setValue('mode', value);
  };

  const validateIPAddress = (value) => {
    // Expresión regular para validar dirección IPv4
    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipAddressRegex.test(value) || 'Formato de dirección IP inválido';
  };

  useEffect(() => {
    const napear = JSON.parse(localStorage.getItem('napear'));

    if (napear?.wan_mode) {
      setWanModeChecked(true);

      switch (napear.wan_mode.mode) {
        case 'DHCP':
          setValue('mode', 'DHCP');
          break;
        case 'PPPoE':
          setValue('mode', 'PPPoE');
          onTogglePPPoE();
          setValue('username', napear.wan_mode.username);
          setValue('password', napear.wan_mode.password);
          break;
        case 'StaticIP':
          setValue('mode', 'StaticIP');
          onToggleStaticIP();
          setValue('ip_address', napear.wan_mode.ip_address);
          setValue('subnet_mask', napear.wan_mode.subnet_mask);
          setValue('default_gateway', napear.wan_mode.default_gateway);
          setValue('dns1', napear.wan_mode.dns1);
          setValue('dns2', napear.wan_mode.dns2);
          break;
      }
    }
  }, []);

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={5} mt={3} mb={4}>
        <FormControl isInvalid={errors.mode}>
          <FormLabel htmlFor="mode" color={'#3E3D3D'}>
            Modo WAN
          </FormLabel>
          <RadioGroup name="mode" paddingLeft={'.1vh'} value={watchModoWan} isDisabled={wanModeChecked}>
            <Flex flexDir={'row'} gap={2} alignItems="start">
              <Flex border={`1px solid ${watchModoWan == 'PPPoE' ? '#0568FF' : '#e9ecef'}`} borderRadius={'1vh'} p={3}>
                <Radio
                  value="PPPoE"
                  {...register('mode', { required: true })}
                  onChange={() => handleModoWANChange('PPPoE')}
                >
                  PPPoE
                </Radio>
              </Flex>
              <Flex border={`1px solid ${watchModoWan == 'DHCP' ? '#0568FF' : '#e9ecef'}`} borderRadius={'1vh'} p={3}>
                <Radio
                  value="DHCP"
                  {...register('mode', { required: true })}
                  onChange={() => handleModoWANChange('DHCP')}
                >
                  DHCP
                </Radio>
              </Flex>
              <Flex
                border={`1px solid ${watchModoWan == 'StaticIP' ? '#0568FF' : '#e9ecef'}`}
                borderRadius={'1vh'}
                p={3}
              >
                <Radio
                  value="StaticIP"
                  {...register('mode', { required: true })}
                  onChange={() => handleModoWANChange('StaticIP')}
                >
                  IP Estática
                </Radio>
              </Flex>
            </Flex>
          </RadioGroup>
          {errors.mode && <FormErrorMessage>Debe seleccionar un modo WAN.</FormErrorMessage>}
        </FormControl>

        {watchModoWan == 'PPPoE' && (
          <Collapse in={isOpenPPPoE} animateOpacity style={{ width: '100%' }}>
            <VStack spacing={5}>
              <FormControl isInvalid={errors.usuario}>
                <FormLabel htmlFor="usuario" color={'#3E3D3D'}>
                  Usuario
                </FormLabel>
                <Input
                  type="text"
                  id="usuario"
                  {...register('username', { required: true })}
                  placeholder="192.158.1.38"
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.usuario && <FormErrorMessage>Este campo es obligatorio.</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={errors.contraseña}>
                <FormLabel htmlFor="contraseña" color={'#3E3D3D'}>
                  Contraseña
                </FormLabel>
                <Input
                  type="text"
                  id="contraseña"
                  placeholder="d775d2b8a9"
                  {...register('password', { required: true })}
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.contraseña && <FormErrorMessage>Este campo es obligatorio.</FormErrorMessage>}
              </FormControl>
            </VStack>
          </Collapse>
        )}

        {watchModoWan == 'StaticIP' && (
          <Collapse in={isOpenStaticIP} animateOpacity style={{ width: '100%' }}>
            <VStack spacing={5}>
              <FormControl isInvalid={errors.ip_address}>
                <FormLabel htmlFor="direccionIPv4" color={'#3E3D3D'}>
                  Dirección IPv4
                </FormLabel>
                <Input
                  type="text"
                  id="direccionIPv4"
                  {...register('ip_address', { required: true, validate: validateIPAddress })}
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                  placeholder="192.168.0.1"
                />
                {errors.ip_address && (
                  <FormErrorMessage>{errors.ip_address.message || 'Este campo es obligatorio.'}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.subnet_mask}>
                <FormLabel htmlFor="subnetMask" color={'#3E3D3D'}>
                  Subnet Mask
                </FormLabel>
                <Input
                  type="text"
                  id="subnetMask"
                  {...register('subnet_mask', { required: true, validate: validateIPAddress })}
                  placeholder="255.255.255.0"
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.subnet_mask && (
                  <FormErrorMessage>{errors.subnet_mask.message || 'Este campo es obligatorio.'}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.default_gateway}>
                <FormLabel htmlFor="default_gateway" color={'#3E3D3D'}>
                  Default Gateway
                </FormLabel>
                <Input
                  type="text"
                  id="default_gateway"
                  {...register('default_gateway', { required: true, validate: validateIPAddress })}
                  placeholder="192.168.0.254"
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.default_gateway && (
                  <FormErrorMessage>{errors.default_gateway.message || 'Este campo es obligatorio.'}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.dns1}>
                <FormLabel htmlFor="dns1" color={'#3E3D3D'}>
                  DNS 1
                </FormLabel>
                <Input
                  type="text"
                  id="dns1"
                  {...register('dns1', { required: true, validate: validateIPAddress })}
                  placeholder="8.8.8.8"
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.dns1 && (
                  <FormErrorMessage>{errors.dns1.message || 'Este campo es obligatorio.'}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.dns2}>
                <FormLabel htmlFor="dns2" color={'#3E3D3D'}>
                  DNS 2
                </FormLabel>
                <Input
                  type="text"
                  id="dns2"
                  {...register('dns2', { required: true, validate: validateIPAddress })}
                  placeholder="8.8.4.4"
                  autoComplete="off"
                  isReadOnly={readOnly && wanModeChecked}
                />
                {errors.dns2 && (
                  <FormErrorMessage>{errors.dns2.message || 'Este campo es obligatorio.'}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </Collapse>
        )}

        {!wanModeChecked && (
          <Flex flexDir={'row'} gap={2} width={'100%'}>
            {!isSubmitted && (
              <Button
                isDisabled={dataIsUploading}
                onClick={() => modalOnClose()}
                type="button"
                width={'100%'}
                fontWeight={'medium'}
                fontSize={'14px'}
                color={'#868383'}
                border={'1px solid #D7D5D5'}
                _hover={{ bg: '#EEEEEE' }}
                bg={'transparent'}
                rounded={'xl'}
              >
                Cancelar
              </Button>
            )}

            <Collapse style={{ width: '100%' }} in={!isOpenSuccessButton} animateOpacity>
              <SuccessButton promise={buttonPromise} />
            </Collapse>
          </Flex>
        )}
      </VStack>
    </form>
  );
}

function FormularioInstalaciones({ modalOnClose, ticketId, readOnly, handleSuccess }) {
  const [localReadOnly, setLocalReadOnly] = useState(readOnly);
  const [buttonPromise, setButtonPromise] = useState();
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [wanModeChecked, setWanModeChecked] = useState(false);

  const { isOpen: uploadFailIsOpen, onToggle: uploadFailOnToggle } = useDisclosure();
  let { isOpen: isOpenWanMode, onToggle: onToggleWanMode } = useDisclosure();
  const { isOpen: isOpenFormButton, onToggle: onToggleFormButton } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      onu: localStorage.getItem('napear') ? JSON.parse(localStorage.getItem('napear')).onu : '',
      precinto: localStorage.getItem('napear') ? JSON.parse(localStorage.getItem('napear')).precinto : '',
    },
  });

  const onSubmit = async (data) => {
    // aplicar toUpperCase a todos los elementos dentro del objeto data
    Object.keys(data).forEach((key) => {
      data[key] = data[key].toUpperCase();
    });

    // Realizar la petición POST al endpoint deseado (reemplaza la URL por la correcta)
    const promise = axios.put('/api/ticket/installation', data);

    setButtonPromise(promise);

    promise
      .then(() => {
        setDataSubmitted(true);

        setTimeout(() => {
          onToggleFormButton();
          setLocalReadOnly(true);
        }, 4000);

        localStorage.setItem('napear', JSON.stringify({ ...data, external_id: ticketId, success: true }));

        handleSuccess(true);
      })
      .catch(() => {
        uploadFailOnToggle();
        localStorage.setItem('napear', JSON.stringify({ ...data, external_id: ticketId, success: false }));
      });
  };

  const onToggleWanModeCheckbox = () => {
    setWanModeChecked((prevChecked) => !prevChecked);
    onToggleWanMode();
  };

  useEffect(() => {
    if (uploadFailIsOpen) {
      setTimeout(() => {
        uploadFailOnToggle();
      }, 8000);
    }
  }, [uploadFailIsOpen]);

  useEffect(() => {
    const localStorageValue = localStorage.getItem('napear');
    const parsedValue = localStorageValue ? JSON.parse(localStorageValue) : false;
    setWanModeChecked(parsedValue.wan_mode ?? false);

    if (parsedValue.wan_mode) {
      onToggleWanMode();
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing={5} mt={3} mb={4}>
          <Collapse in={uploadFailIsOpen} animateOpacity>
            <Alert bg={'#F94244'} rounded={'md'} color={'white'} flexDir={'column'} gap={'.5vh'}>
              <Text fontWeight={'bold'} fontSize={'16px'} width={'100%'}>
                Ocurrió un error
              </Text>
              <Text fontSize={'14px'}>Por favor, verificá que los datos sean correctos y volvé a intentarlo.</Text>
            </Alert>
          </Collapse>

          <FormControl isInvalid={errors.onu}>
            <FormLabel htmlFor="onu" color={'#3E3D3D'}>
              SN de ONU
            </FormLabel>
            <Input
              type="text"
              id="onu"
              {...register('onu', { required: true })}
              autoComplete="off"
              isReadOnly={localReadOnly}
            />
            {errors.onu && <FormErrorMessage>Este campo es obligatorio.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={errors.precinto}>
            <FormLabel htmlFor="precinto" color={'#3E3D3D'}>
              Precinto
            </FormLabel>
            <Input
              type="text"
              id="precinto"
              {...register('precinto', { required: true })}
              autoComplete="off"
              isReadOnly={localReadOnly}
            />
            {errors.precinto && <FormErrorMessage>Este campo es obligatorio.</FormErrorMessage>}
          </FormControl>

          {!readOnly && (
            <Collapse in={!isOpenFormButton} animateOpacity style={{ width: '100%' }}>
              <Flex flexDir={'row'} gap={2} width={'100%'}>
                {!dataSubmitted && (
                  <Button
                    onClick={() => modalOnClose()}
                    type="button"
                    width={'100%'}
                    fontWeight={'medium'}
                    fontSize={'14px'}
                    color={'#868383'}
                    border={'1px solid #D7D5D5'}
                    _hover={{ bg: '#EEEEEE' }}
                    bg={'transparent'}
                    rounded={'xl'}
                  >
                    Cancelar
                  </Button>
                )}

                <SuccessButton promise={buttonPromise} />
              </Flex>
            </Collapse>
          )}

          <Collapse in={readOnly ? true : isOpenFormButton} animateOpacity style={{ width: '100%' }}>
            <Flex flexDir={'row'} gap={2} width={'100%'}>
              {readOnly && wanModeChecked ? (
                <Checkbox
                  colorScheme="linkedin"
                  paddingLeft={'.1vh'}
                  onChange={onToggleWanModeCheckbox}
                  isChecked={wanModeChecked}
                  isDisabled={true}
                />
              ) : (
                <Checkbox
                  colorScheme="linkedin"
                  paddingLeft={'.1vh'}
                  onChange={onToggleWanModeCheckbox}
                  isChecked={wanModeChecked}
                />
              )}
              <Text fontSize={'14px'} fontWeight={'medium'} color={'#3E3D3D'}>
                Configurar Modo WAN
              </Text>
            </Flex>
          </Collapse>
        </VStack>
      </form>
      <Collapse in={isOpenWanMode} animateOpacity style={{ width: '100%' }}>
        <FormularioWanMode modalOnClose={() => modalOnClose()} readOnly={readOnly} handleError={uploadFailOnToggle} />
      </Collapse>

      <Flex flexDir={'row'} justifyContent={'center'} alignItems={'center'} m={3}>
        <Text fontSize={'12px'} fontWeight={'medium'} color={'#A4A2A2'}>
          Powered by
        </Text>
        <Image src="https://admin.nape.ar/logo/logo-beta.png" alt="NAPEA.AR" width={80} height={60} />
      </Flex>
    </>
  );
}

function FormularioBajas({ modalOnClose, ticketId, readOnly, codigoCliente }) {
  const [dataIsUploading, setDataIsUploading] = useState(false);
  const [options, setOptions] = useState([]);
  const { isOpen: uploadFailIsOpen, onToggle: uploadFailOnToggle } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      selectField: [],
    },
  });

  const onSubmit = async (data) => {
    setDataIsUploading(true);

    let success = false;
    try {
      // Realizar la petición POST al endpoint deseado (reemplaza la URL por la correcta)
      await axios.post('https://6492edcd428c3d2035d0ec8b.mockapi.io/instalacion', data);

      success = true;
      // Restablecer el formulario después del envío exitoso
      reset();
    } catch (error) {
      // Manejar errores de la petición aquí
      uploadFailOnToggle();
      // Mostrar una alerta de error
    }

    localStorage.setItem('napear', JSON.stringify({ ...data, external_id: ticketId, success }));

    // Mostrar una alerta de éxito
    modalOnClose(true);

    setDataIsUploading(false);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: errors.selectField ? '#E53E3E' : provided.borderColor,
      fontSize: '14px',
    }),
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await axios.get(`/api/ticket/baja?codigo_cliente=${codigoCliente}`);

        if (data.data.length > 0) {
          setOptions(data.data.map((item) => ({ label: item.serie, value: item.id })));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOptions();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      const inputValue = event.target.value.trim();

      if (inputValue !== '') {
        const newOption = {
          label: inputValue,
          value: inputValue.toUpperCase(),
        };

        setOptions((prevOptions) => [...prevOptions, newOption]);
        event.target.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <VStack spacing={5} mt={3} mb={4}>
        <Collapse in={uploadFailIsOpen} animateOpacity>
          <Alert bg={'#F94244'} rounded={'md'} fontSize={'14px'} color={'white'} fontWeight={'medium'}>
            Ocurrió un error al cargar los datos de instalación. Por favor, verificá que los datos sean correctos y
            volvé a intentarlo.
          </Alert>
        </Collapse>

        {/* Select Field */}
        <FormControl isInvalid={errors.selectField}>
          <FormLabel htmlFor="selectField" color={'#3E3D3D'}>
            Equipos
          </FormLabel>
          <Select
            id="selectField"
            options={options}
            isMulti
            isSearchable
            isClearable
            {...register('selectField')}
            styles={customStyles}
            onKeyDown={handleKeyDown}
            placeholder={'Seleccioná los equipos a dar de baja'}
            noOptionsMessage={() => 'No se encontraron equipos'}
          />
          {errors.selectField && <FormErrorMessage>Este campo es obligatorio.</FormErrorMessage>}
        </FormControl>

        {!readOnly && (
          <Flex flexDir={'row'} gap={2} width={'100%'}>
            <Button
              isDisabled={dataIsUploading}
              onClick={() => modalOnClose()}
              type="button"
              width={'100%'}
              fontWeight={'medium'}
              fontSize={'14px'}
              color={'#868383'}
              border={'1px solid #D7D5D5'}
              _hover={{ bg: '#EEEEEE' }}
              bg={'transparent'}
              rounded={'xl'}
            >
              Cancelar
            </Button>

            <Button
              isLoading={dataIsUploading}
              type="submit"
              width={'100%'}
              fontWeight={'medium'}
              fontSize={'14px'}
              color={'white'}
              _hover={{ bg: '#085AFF' }}
              bg={'#0568FF'}
              rounded={'xl'}
            >
              Cargar
            </Button>
          </Flex>
        )}
      </VStack>
    </form>
  );
}

export default FormularioInstalaciones;

/**
 * Modal que uso para cargar los datos de instalacion
 */
export const NapearModalInstalaciones = ({ handleSuccess, onClose, isOpen, ticketId, readOnly = true }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<FiSettings color={'#00A32E'} />}
      title={'Datos de Instalación'}
      description={
        readOnly
          ? 'ONU y precinto cargados en NAPEAR por medio de DO+.'
          : 'Luego de completar los datos de instalacion, DO+ se encargara de habilitar la ONU a través de NAPEAR.'
      }
      bodyContent={
        <FormularioInstalaciones
          modalOnClose={(success) => onClose(success)}
          ticketId={ticketId}
          readOnly={readOnly}
          handleSuccess={handleSuccess}
        />
      }
      colorIcon={'green.100'}
    />
  );
};

export const NapearModalBajas = ({ onClose, isOpen, readOnly = false, codigoCliente }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<FiSettings color={'#00A32E'} />}
      title={'Datos de Baja'}
      description={
        readOnly ? 'Equipos retirados del cliente' : 'A continuación, indique los equipos que se retiraron del cliente.'
      }
      bodyContent={
        <FormularioBajas
          modalOnClose={(success) => onClose(success)}
          readOnly={readOnly}
          codigoCliente={codigoCliente}
        />
      }
      colorIcon={'green.100'}
    />
  );
};
