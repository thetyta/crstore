'use client'
import { Box, Image, Heading, Text, VStack, Flex, Input, InputGroup, Button } from "@chakra-ui/react";
import React from 'react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { api } from "@/utils/axios";
import UserRegisterForm from "@/components/GeneralComp/Cadastro/signInInput";


export default function Registrar() {
  const router = useRouter();
  const [input, setInput] = useState({
  name: '',
  cpf: '',
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  });

  const handleSubmit = async () => {
    // Validação de campos obrigatórios
    if (
      !input.name ||
      !input.cpf ||
      !input.username ||
      !input.phone ||
      !input.email ||
      !input.password ||
      !input.confirmPassword
    ) {
      toaster.create({ description: "Preencha todos os campos!", type: "error" });
      return;
    }

    const cpfNumeros = input.cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      toaster.create({ description: "CPF inválido! Deve conter 11 números.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      toaster.create({ description: "Email inválido!", type: "error" });
      return;
    }

    if (input.password.length < 6) {
      toaster.create({ description: "A senha deve ter pelo menos 6 caracteres.", type: "error" });
      return;
    }

    if (input.password !== input.confirmPassword) {
      toaster.create({ description: "As senhas não coincidem!", type: "error" });
      return;
    }

    try {
      const response = await api.post('/criar-usuario', input);
      if (!response) {
        toaster.create({ description: "Erro ao cadastrar!", type: "error" });
        return;
      }
      toaster.create({ description: "Cadastro enviado!", type: "success" });
      router.push('/');
    } catch (error) {
      toaster.create({ description: "Erro ao cadastrar!", type: "error" });
    }
  };

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
    <Flex
        minH="100vh"
        align="flex-start"
        justify="center"
        backgroundColor={"white"}
        backgroundSize={'cover'}
        backgroundPosition={'center'}
    >
         <UserRegisterForm input={input} setInput={setInput} onSubmit={handleSubmit} />
    </Flex>
  );
}