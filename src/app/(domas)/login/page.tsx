'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Box, Center, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import axios from 'axios';

import { Inputs } from '@/types/Form/inputs';
import Cookies from 'js-cookie';

import { useGradientOfTheDay } from '@/hooks/useGradientOfTheDay';
import { AuthForm } from '@/components/auth/authForm';

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
