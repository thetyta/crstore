'use client'
import { Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import React from 'react';
import LoginInput from "@/components/GeneralComp/Login/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation';
import { api } from "@/utils/axios";


export default function LoginPc() {
  const router = useRouter();


const loginUsuario = async (content) => {
  try {
    const response = await api.post(`/usuario/login`, { ...content });
    if (response.status === 200 && response.data?.response) {
      toaster.create({
        description: "Login realizado com sucesso! Redirecionando...",
        type: "success",
      });
      localStorage.setItem('token', response.data.response);
      router.push('/main');
    } else {
      toaster.create({
        description: "Usuário ou senha inválidos!",
        type: "error",
      });
    }
  } catch (error) {
    toaster.create({
      description: `ERROR! ${error?.response?.data?.message || error.message}`,
      type: "error",
    });
  }
};

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content)
  };


  return (
    <Box
      w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center" 
      filter="contrast(95%)"
      bgImage={"url(/blawhi.jpg)"}
      bgSize="100% 115%"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box w="100%" display="flex" justifyContent="center" alignItems="center">
        <Image
          w="100%"
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D"
          alt="Loading..."
        />
      </Box>

      <Box
        w="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack align="left" >
          <Heading color="white" textAlign="center" as="h1" fontSize={40} fontWeight={600} >
            Bem-Vindo
            <span style={{ fontFamily: "monospace", fontSize: "1.2em", color: "white" }}>!</span>
          </Heading>
          <Text m="0" fontSize="lg" color="white" opacity={0.8} >
            IFood piorado
          </Text>
          <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
} 