import { Box, Heading, Flex, Input, InputGroup, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";

export default function UserRegisterForm({ input, setInput, onSubmit }) {
  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    name: !input.name,
    cpf: !input.cpf,
    username: !input.username,
    phone: !input.phone,
    email: !input.email,
    password: !input.password,
    confirmPassword: !input.confirmPassword || input.password !== input.confirmPassword,
  };

  // Função para submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowErrors(true);
    onSubmit();
  };

  return (
    <Box p={8} mt={16} borderRadius="md" boxShadow="md" backgroundColor={'black'}>
      <Heading mb={4} textAlign="center" color="white">Cadastro de usuário</Heading>
      <Flex gap={4} mt="7%" w="100%">
        <Box w="100%">
          <InputGroup>
            <Input
              variant="outline"
              placeholder="Nome"
              _placeholder={{ color: "gray.400" }}
              value={input.name}
              isInvalid={showErrors && errors.name}
              onChange={e => setInput({ ...input, name: e.target.value })}
            />
          </InputGroup>
          {showErrors && errors.name && (
            <Text color="red.400" fontSize="sm" mt={1}>Preencha o nome.</Text>
          )}
        </Box>
        <Box w="100%">
          <InputGroup>
            <Input
              variant="outline"
              placeholder="CPF"
              _placeholder={{ color: "gray.400" }}
              value={input.cpf}
              isInvalid={showErrors && errors.cpf}
              onChange={e => setInput({ ...input, cpf: e.target.value })}
            />
          </InputGroup>
          {showErrors && errors.cpf && (
            <Text color="red.400" fontSize="sm" mt={1}>Preencha o CPF.</Text>
          )}
        </Box>
      </Flex>
      <Box mt="2%" w="100%">
        <InputGroup>
          <Input
            variant="outline"
            placeholder="Username"
            _placeholder={{ color: "gray.400" }}
            value={input.username}
            isInvalid={showErrors && errors.username}
            onChange={e => setInput({ ...input, username: e.target.value })}
          />
        </InputGroup>
        {showErrors && errors.username && (
          <Text color="red.400" fontSize="sm" mt={1}>Preencha o username.</Text>
        )}
      </Box>
      <Box mt="2%" w="100%">
        <InputGroup>
          <Input
            variant="outline"
            placeholder="Telefone"
            _placeholder={{ color: "gray.400" }}
            value={input.phone}
            isInvalid={showErrors && errors.phone}
            onChange={e => setInput({ ...input, phone: e.target.value })}
          />
        </InputGroup>
        {showErrors && errors.phone && (
          <Text color="red.400" fontSize="sm" mt={1}>Preencha o telefone.</Text>
        )}
      </Box>
      <Box mt="2%" w="100%">
        <InputGroup>
          <Input
            variant="outline"
            placeholder="Email"
            _placeholder={{ color: "gray.400" }}
            value={input.email}
            isInvalid={showErrors && errors.email}
            onChange={e => setInput({ ...input, email: e.target.value })}
          />
        </InputGroup>
        {showErrors && errors.email && (
          <Text color="red.400" fontSize="sm" mt={1}>Preencha o email.</Text>
        )}
      </Box>
      <Flex gap={4} w="100%">
        <Box mt="2%" w="100%">
          <InputGroup>
            <Input
              variant="outline"
              placeholder="Senha"
              type="password"
              _placeholder={{ color: "gray.400" }}
              value={input.password}
              isInvalid={showErrors && errors.password}
              onChange={e => setInput({ ...input, password: e.target.value })}
            />
          </InputGroup>
          {showErrors && errors.password && (
            <Text color="red.400" fontSize="sm" mt={1}>Preencha a senha.</Text>
          )}
        </Box>
        <Box mt="2%" w="100%">
          <InputGroup>
            <Input
              variant="outline"
              placeholder="Confirmar Senha"
              type="password"
              _placeholder={{ color: "gray.400" }}
              value={input.confirmPassword}
              isInvalid={showErrors && errors.confirmPassword}
              onChange={e => setInput({ ...input, confirmPassword: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </InputGroup>
          {showErrors && errors.confirmPassword && (
            <Text color="red.400" fontSize="sm" mt={1}>
              {!input.confirmPassword
                ? "Confirme a senha."
                : "As senhas não coincidem."}
            </Text>
          )}
        </Box>
      </Flex>
      <Flex mt="4%" gap={4} w="100%">
        <Button colorScheme="green" onClick={handleSubmit}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        >Cadastrar</Button>
      </Flex>
    </Box>
  );
}