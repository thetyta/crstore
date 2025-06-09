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
  const [produtos, setProdutos] = useState([]);
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [desconto, setDesconto] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca informações do usuário (endereços e carrinho)
        const userRes = await api.get("/usuario/info");
        setEnderecos(userRes.data.resposta.enderecos || []);
        setCarrinho(userRes.data.resposta.cart || []);
        
        // Busca produtos para calcular preços
        const prodRes = await api.get("/produto");
        setProdutos(prodRes.data.data || []);
        
        // Busca as informações do cupom aplicado no localStorage
        const cupomInfo = localStorage.getItem("cupomAplicado");
        const descontoInfo = localStorage.getItem("desconto");
        
        if (cupomInfo && descontoInfo) {
          const cupomData = JSON.parse(cupomInfo);
          setCupomAplicado(cupomData);
          
          // Recalcula o desconto baseado no subtotal atual usando os dados já carregados
          const carrinhoAtual = userRes.data.resposta.cart || [];
          const subtotal = carrinhoAtual.reduce((total, item) => {
            const produto = prodRes.data.data.find(p => p.id === item.idProduct);
            if (produto) {
              return total + (produto.price * item.quantity);
            }
            return total;
          }, 0);
          
          let valorDesconto = 0;
          if (cupomData.type === 'valor') {
            valorDesconto = parseFloat(cupomData.value);
          } else if (cupomData.type === 'porcentagem') {
            valorDesconto = (subtotal * parseFloat(cupomData.value)) / 100;
          }
          
          setDesconto(valorDesconto);
        }
      } catch (err) {
        setEnderecos([]);
        setCarrinho([]);
        setProdutos([]);
      }
    }

    // Busca métodos de pagamento
    api.get("/pagamento")
      .then(res => setPagamentos(res.data.data || []))
      .catch(() => setPagamentos([]))
      .finally(() => setLoading(false));
      
    fetchData();
  }, []);

  // Função para calcular subtotal
  const getSubtotal = () => {
    return carrinho.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.idProduct);
      if (produto) {
        return total + (produto.price * item.quantity);
      }
      return total;
    }, 0);
  };

  // Função para calcular total com desconto
  const getTotal = () => {
    const subtotal = getSubtotal();
    return Math.max(0, subtotal - desconto);
  };

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
      const dadosPedido = {
        idAddress: enderecoSelecionado,
        idPayment: pagamentoSelecionado,
        cart: carrinho
      };
      
      // Adiciona informações do cupom se existir
      if (cupomAplicado) {
        dadosPedido.idCupom = cupomAplicado.id;
        dadosPedido.desconto = desconto;
      }
      
      await api.post("/criar-pedido-do-carrinho", dadosPedido);
      
      // Limpa as informações do cupom do localStorage após finalizar o pedido
      localStorage.removeItem("cupomAplicado");
      localStorage.removeItem("desconto");
      
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
              
              {/* Resumo do Pedido */}
              <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <Heading size="md" mb={3} color="black">Resumo do Pedido</Heading>
                <Text color="black">
                  <strong>Subtotal:</strong> R$ {getSubtotal().toFixed(2)}
                </Text>
                {cupomAplicado && desconto > 0 && (
                  <>
                    <Text color="black">
                      <strong>Cupom aplicado:</strong> {cupomAplicado.code}
                    </Text>
                    <Text color="red.500">
                      <strong>Desconto:</strong> -R$ {desconto.toFixed(2)}
                    </Text>
                  </>
                )}
                <Text fontSize="lg" fontWeight="bold" color="green.600">
                  <strong>Total:</strong> R$ {getTotal().toFixed(2)}
                </Text>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}