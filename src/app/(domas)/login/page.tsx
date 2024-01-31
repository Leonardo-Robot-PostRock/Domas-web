'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { SubmitHandler, useForm } from 'react-hook-form';

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import { colord } from 'colord';
import axios from 'axios';

import { Inputs } from '@/types/Form/inputs';
import Cookies from 'js-cookie';

import useGradientOfTheDay from '@/hooks/useGradientOfTheDay';

export default function SignInPage() {
  const toast = useToast();
  const router = useRouter();

  const [submitIsLoading, setSubmitIsLoading] = useState<boolean>(false);
  const { gradientOfTheDay } = useGradientOfTheDay();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    Cookies.remove('auth_service');
    setSubmitIsLoading(true);
    axios
      .post('/api/login', data)
      .then((res) => {
        const { user } = res.data;
        const { auth_service } = res.data.sessionCookie;

        localStorage.setItem('user', JSON.stringify(user));

        Cookies.set('auth_service', auth_service, {
          expires: 0.5,
        });

        router.push('/today_orders');
      })
      .catch((err) => {
        console.error(err);

        toast({
          position: 'top',
          isClosable: true,
          render: () => (
            <Box bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
              Las credenciales no pertenecen a ningún usuario de DO+
            </Box>
          ),
        });
      })
      .finally(() => setSubmitIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue(`linear-gradient(to right, ${gradientOfTheDay})`, 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'0px 5px 28px 0px rgba(0,0,0,0.4)'}
            p={8}
          >
            <Center mb={5}>
              <Avatar size="xl" src={'/logo.svg'} />
            </Center>
            <Stack spacing={4}>
              <FormControl id="username" isInvalid={!!errors.username}>
                <FormLabel>Usuario</FormLabel>
                <Input
                  type="text"
                  {...register('username', {
                    required: true,
                  })}
                />
                {errors.username && <FormErrorMessage>El usuario es obligatorio.</FormErrorMessage>}
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  {...register('password', {
                    required: true,
                  })}
                />
                {errors.password && <FormErrorMessage>La contraseña es obligatoria.</FormErrorMessage>}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={gradientOfTheDay.split(',')[0]}
                  color={'white'}
                  _hover={{
                    bg: colord(gradientOfTheDay.split(',')[0]).darken(0.05).toHex(),
                  }}
                  onClick={handleSubmit(onSubmit)}
                  isLoading={submitIsLoading}
                >
                  Ingresar a DO+
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
