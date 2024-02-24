/* eslint-disable @typescript-eslint/naming-convention */
'use client';
import { type ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';

import { type SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Box, Center, Flex, Stack, useColorModeValue, useToast } from '@chakra-ui/react';

import axios from 'axios';

import type { Inputs } from '@/types/Form/inputs';
import Cookies from 'js-cookie';

import { useGradientOfTheDay } from '@/hooks/useGradientOfTheDay';
import { AuthForm } from './AuthForm';

export default function LoginForm(): ReactNode {
  const toast = useToast();
  const router = useRouter();

  const [submitIsLoading, setSubmitIsLoading] = useState<boolean>(false);
  const { gradientOfTheDay } = useGradientOfTheDay();

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs): Promise<void> => {
    Cookies.remove('auth_service');
    setSubmitIsLoading(true);
    try {
      const response = await axios.post('/api/login', data);
      const { user } = response.data;
      const { auth_service } = response.data.sessionCookie;

      localStorage.setItem('user', JSON.stringify(user));

      Cookies.set('auth_service', auth_service as string, {
        expires: 0.5
      });

      router.push('/teams');
    } catch (error) {
      console.error(error);

      toast({
        position: 'top',
        isClosable: true,
        render: () => (
          <Box bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
            Las credenciales no pertenecen a ningún usuario de DO+
          </Box>
        )
      });
    } finally {
      setSubmitIsLoading(false);
    }
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
            <AuthForm
              onSubmit={handleSubmit(onSubmit)}
              isLoading={submitIsLoading}
              errors={errors}
              register={register}
            />
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
