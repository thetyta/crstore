'use client';
import { useState } from "react";
import { Box, Heading, Input, Button, Text } from "@chakra-ui/react";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function CadastrarEnderecoPage() {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleCadastrar = async () => {
    setErro("");
    if (!street || !neighborhood || !city || !state || !zipCode) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/criar-endereco", {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
      });
      router.push("/main");
    } catch (err) {
      setErro("Erro ao cadastrar endereço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Cadastrar Endereço</Heading>
      <Input
        placeholder="Rua"
        value={street}
        onChange={e => setStreet(e.target.value)}
        mb={3}
        isRequired
      />
      <Input
        placeholder="Número"
        value={number}
        onChange={e => setNumber(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Bairro"
        value={neighborhood}
        onChange={e => setNeighborhood(e.target.value)}
        mb={3}
        isRequired
      />
      <Input
        placeholder="Cidade"
        value={city}
        onChange={e => setCity(e.target.value)}
        mb={3}
        isRequired
      />
      <Input
        placeholder="Estado"
        value={state}
        onChange={e => setState(e.target.value)}
        mb={3}
        isRequired
      />
      <Input
        placeholder="CEP"
        value={zipCode}
        onChange={e => setZipCode(e.target.value)}
        mb={5}
        isRequired
      />
      {erro && <Text color="red.500" mb={3}>{erro}</Text>}
      <Button
        colorScheme="green"
        w="100%"
        onClick={handleCadastrar}
        isLoading={loading}
      >
        Cadastrar Endereço
      </Button>
    </Box>
  );
}