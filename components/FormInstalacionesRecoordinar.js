import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Select,
  VStack,
} from '@chakra-ui/react';

const options = [
  { value: 'FALTANTE_POSTES', label: 'Faltante de postes (FTTH)' },
  { value: 'NAP_SATURADA', label: 'NAP saturada (FTTH)' },
  { value: 'CLIENTE_PIDE_RECOORDINAR', label: 'Cliente pide recoordinar (FTTH/W)' },
  { value: 'CLIENTE_FUERA_DOMICILIO', label: 'Cliente no esta en el domicilio y no responde llamados (FTTH/W)' },
  { value: 'FALTANTE_MATERIALES', label: 'Falta de materiales' },
  { value: 'DOMICILIO_COMPLICADO', label: 'Domicilio complicado de instalar' },
  { value: 'PROBLEMAS_PERSONALES', label: 'Problemas personales' },
];

const MyForm = ({ ticket_id, mesa_username }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const causa = watch('issue');

  const onSubmit = async (data) => {
    data.ticket_id = ticket_id;
    data.mesa_username = mesa_username;
    data.comment = data.comment || `Tecnico indica ${options.filter((option) => option.value === data.issue)[0].label}`;

    await fetch('/api/ticket/installation', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '3vh 0vh 3vh 0vh' }}>
      <VStack spacing={7}>
        <FormControl>
          <FormLabel color={'#3E3D3D'}>Causa</FormLabel>
          <Controller
            control={control}
            name="issue"
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} placeholder="Seleccionar la causa">
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />

          {errors.issue && <FormErrorMessage>{errors.issue.message}</FormErrorMessage>}
        </FormControl>

        {causa == 'FALTANTE_POSTES' && (
          <FormControl isInvalid={errors.customer_geo}>
            <FormLabel htmlFor="geo_cliente" color={'#3E3D3D'}>
              Georeferencia de cliente
            </FormLabel>
            <Input
              type="text"
              id="geo_cliente"
              placeholder="-32.88856743568419, -68.84020895231535"
              {...register('customer_geo', {
                required: true,
                pattern: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/i,
              })}
              autoComplete="off"
            />
            <FormHelperText>
              La geolocalización puede ser extraída desde{' '}
              <Link href="https://www.google.com/maps/" isExternal={true} color={'#0568FF'}>
                Google Maps.
              </Link>
            </FormHelperText>
            {errors.customer_geo && (
              <FormErrorMessage>Este campo es obligatorio y debe ser una geolocalización válida.</FormErrorMessage>
            )}
          </FormControl>
        )}

        {causa == 'NAP_SATURADA' && (
          <FormControl isInvalid={errors.napLink}>
            <FormLabel htmlFor="napLink" color={'#3E3D3D'}>
              Link de QR de NAP
            </FormLabel>
            <Controller
              control={control}
              name="napLink"
              rules={{ required: 'Debe seleccionar una causa' }}
              render={({ field }) => (
                <Input {...field} placeholder="Link de QR de NAP" isInvalid={errors.napLink} id="napLink" />
              )}
            />
            {errors.napLink && <FormErrorMessage>{errors.napLink.message}</FormErrorMessage>}
          </FormControl>
        )}

        {causa == 'PROBLEMAS_PERSONALES' && (
          <Controller
            control={control}
            name="recordinar_todo"
            render={({ field }) => (
              <Checkbox {...field} style={{ width: '100%' }}>
                Recoordinar éste y los tickets restantes
              </Checkbox>
            )}
          />
        )}

        <Button type="submit" variant="primary_custom">
          Cerrar ticket
        </Button>
      </VStack>
    </form>
  );
};

export default MyForm;
