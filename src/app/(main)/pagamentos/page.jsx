'use client';
import { useEffect, useState } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function PagamentosPage() {
  const [enderecos, setEnderecos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get("/usuario/info")
      .then(res => {
        setEnderecos(res.data.resposta.enderecos || []);
        setCarrinho(res.data.resposta.cart || []);
      })
      .catch(() => {
        setEnderecos([]);
        setCarrinho([]);
      });

    api.get("/pagamento")
      .then(res => setPagamentos(res.data.data || []))
      .catch(() => setPagamentos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFinalizar = async () => {
    if (!enderecoSelecionado || !pagamentoSelecionado) {
      alert("Selecione endereço e método de pagamento!");
      return;
    }
    if (!carrinho.length) {
      alert("Seu carrinho está vazio!");
      return;
    }
    try {
      await api.post(
        "/criar-pedido-do-carrinho",
        {
          idAddress: enderecoSelecionado,
          idPayment: pagamentoSelecionado,
          cart: carrinho
        }
      );
      router.push("/pedidos");
      toaster.create({
        title: "Compra finalizada com sucesso!",
        description: "Seu pedido foi criado e está sendo processado.",
        type: "success",
        duration: 5000,
        isClosable: true
      })
    } catch (err) {
      alert("Erro ao finalizar compra!");
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Pagamento</Heading>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          {enderecos.length === 0 ? (
            <>
              <Text mb={4}>
                Você não possui endereços cadastrados. 
                Por favor, cadastre um endereço antes de finalizar a compra.
              </Text>
              <Button
                colorScheme="blue"
                w="100%"
                onClick={() => router.push("/cadastrar-endereco")}
              >
                Cadastrar Endereço
              </Button>
            </>
          ) : (
            <>
              <Text mb={2}>Escolha o endereço de entrega:</Text>
              <select
                style={{
                  width: "100%",
                  height: "40px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  padding: "0 8px"
                }}
                value={enderecoSelecionado}
                onChange={e => setEnderecoSelecionado(e.target.value)}
              >
                <option value="">Selecione o endereço</option>
                {enderecos.map(end => (
                  <option key={end.id} value={end.id}>
                    {end.street} {end.number ? `, ${end.number}` : ""} - {end.city}
                  </option>
                ))}
              </select>
              <Text mb={2}>Escolha o método de pagamento:</Text>
              <select
                style={{
                  width: "100%",
                  height: "40px",
                  marginBottom: "24px",
                  borderRadius: "8px",
                  padding: "0 8px"
                }}
                value={pagamentoSelecionado}
                onChange={e => setPagamentoSelecionado(e.target.value)}
              >
                <option value="">Selecione o pagamento</option>
                {pagamentos.map(pag => (
                  <option key={pag.id} value={pag.id}>
                    {pag.name}
                  </option>
                ))}
              </select>
              <Button
                colorScheme="green"
                w="100%"
                onClick={handleFinalizar}
                isDisabled={!enderecoSelecionado || !pagamentoSelecionado}
              >
                Finalizar Compra
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
}