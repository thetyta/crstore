'use client'
import { useEffect, useState } from "react";
import { Box, Heading, Text, Image, Stack, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { CiCirclePlus, CiCircleMinus} from "react-icons/ci";

export default function CarrinhoPage() {
  const [cart, setCart] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const router = useRouter();

  // Busca o carrinho e os produtos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    async function fetchCart() {
      try {
        const res = await api.get("/usuario/info", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.resposta.cart || []);
        if (res.data.resposta.cart && res.data.resposta.cart.length > 0) {
          const ids = res.data.resposta.cart.map(item => item.idProduct);
          const prods = await api.get("/produto");
          setProdutos(prods.data.data.filter(p => ids.includes(p.id)));
        }
      } catch {
        setCart([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
    
    // Carrega o cupom aplicado do localStorage se existir
    const cupomInfo = localStorage.getItem("cupomAplicado");
    const descontoInfo = localStorage.getItem("desconto");
    
    if (cupomInfo && descontoInfo) {
      setCupomAplicado(JSON.parse(cupomInfo));
      setDesconto(parseFloat(descontoInfo));
      setCupom(JSON.parse(cupomInfo).code);
    }
  }, []);

  function getProduct(id) {
    return produtos.find(p => p.id === id);
  }

  const handleUpdateQuantity = async (idProduct, newQuantity) => {
    
    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/usuario/carrinho",
        { idProduct, quantity: newQuantity},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(cart =>
        cart.map(item =>
          item.idProduct === idProduct ? { ...item, quantity: newQuantity } : item
        )
      );
      const res = await api.get("/usuario/info", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.resposta.cart || []);
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  };

  const handleRemove = async (idProduct) => {
    const token = localStorage.getItem("token");
    try {
      const item = cart.find(i => i.idProduct === idProduct);
      if (!item) return;
      await api.post(
        "/usuario/carrinho",
        { idProduct, quantity: -item.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(cart => cart.filter(item => item.idProduct !== idProduct));
      const res = await api.get("/usuario/info", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.resposta.cart || []);
    } catch (err) {
    }
  };

  const handleVerificarCupom = async () => {
    if (!cupom.trim()) {
      alert("Digite um cupom válido");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      // Busca todos os cupons
      const res = await api.get('/cupom', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const cupons = res.data.data;
      
      // Procura o cupom pelo código
      const cupomData = cupons.find(c => c.code === cupom);
      
      if (cupomData) {
        const subtotal = getSubtotal();
        let valorDesconto = 0;
        
        if (cupomData.type === 'valor') {
          valorDesconto = parseFloat(cupomData.value);
        } else if (cupomData.type === 'porcentagem') {
          valorDesconto = (subtotal * parseFloat(cupomData.value)) / 100;
        }
        
        setDesconto(valorDesconto);
        setCupomAplicado(cupomData);
        
        // Salva as informações do cupom no localStorage para usar na tela de pagamentos
        localStorage.setItem("cupomAplicado", JSON.stringify(cupomData));
        localStorage.setItem("desconto", valorDesconto.toString());
        
        alert(`Cupom aplicado com sucesso! Desconto de R$ ${valorDesconto.toFixed(2)}`);
      } else {
        alert("Cupom inválido");
        setDesconto(0);
        setCupomAplicado(null);
        
        // Remove as informações do cupom do localStorage
        localStorage.removeItem("cupomAplicado");
        localStorage.removeItem("desconto");
      }
    } catch (err) {
      alert("Cupom não encontrado ou inválido");
      setDesconto(0);
      setCupomAplicado(null);
      
      // Remove as informações do cupom do localStorage
      localStorage.removeItem("cupomAplicado");
      localStorage.removeItem("desconto");
    }
  };

  const handleRemoverCupom = () => {
    setDesconto(0);
    setCupomAplicado(null);
    setCupom("");
    
    // Remove as informações do cupom do localStorage
    localStorage.removeItem("cupomAplicado");
    localStorage.removeItem("desconto");
    
    alert("Cupom removido com sucesso!");
  };

  function getSubtotal() {
    return cart.reduce((total, item) => {
      const prod = produtos.find(p => p.id === item.idProduct);
      return total + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }

  function getTotal() {
    const subtotal = getSubtotal();
    return Math.max(0, subtotal - desconto);
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Seu Carrinho</Heading>
      <Button mb={8} colorScheme="red" onClick={() => router.push("/main")}>
        Voltar para a página principal
      </Button>
      {loading ? (
        <Text>Carregando...</Text>
      ) : cart.length === 0 ? (
        <Text>Seu carrinho está vazio.</Text>
      ) : (
        <Stack spacing={6}>
          {cart.map((item, idx) => {
            const prod = getProduct(item.idProduct);
            return (
              <Flex key={idx} align="center" gap={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <Image
                  src={prod?.imageURL || "/placeholder.jpg"}
                  alt={prod?.name || "Produto"}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box flex="1">
                  <Heading size="md" color={"black"}>{prod?.name || "Produto"}</Heading>
                  <Text color="gray.600">{prod?.description}</Text>
                  <Flex align="center" mt={2}>
                    <Text fontWeight="bold"color={"black"} mr={2}>Quantidade:</Text>
                    <IconButton
                      size="sm"
                      aria-label="Diminuir"
                      onClick={() => handleUpdateQuantity(item.idProduct, -1)}
                      mr={2}
                      variant="outline"
                      bg="#a30c02"
                      borderColor="gray.300"
                      _hover={{ bg: "red.800" }}
                    ><CiCircleMinus color="white" /> </IconButton>
                    <Text mx={2} color={"black"}>{item.quantity}</Text>
                    <IconButton
                      size="sm"
                      aria-label="Aumentar"
                      onClick={() => handleUpdateQuantity(item.idProduct, 1)}
                      mr={2}
                      variant="outline"
                      bg="green"
                      borderColor="gray.300"
                      _hover={{ bg: "green.800" }}
                    ><CiCirclePlus color="white" /></IconButton>
                    <IconButton
                      size="sm"
                      bg={'red'}
                      aria-label="Remover"
                      colorScheme="red"
                      onClick={() => handleRemove(item.idProduct)}
                    ><MdDelete color="white"/> </IconButton>
                  </Flex>
                  <Text color="green.700" fontWeight="bold" mt={2}>
                    Preço unitário: R$ {prod?.price} <br />Preço total: R$ {(prod?.price * item.quantity).toFixed(2)}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
      {cart.length > 0 && ( 
        <Flex mt={8} justify="space-between" align="center" bg={"white"} rounded={'md'} p={4}>
          <Button
            bg={'green'}
            color={'white'}
            fontWeight={'bold'}
            onClick={() => router.push("/pagamentos")}
          >
            Finalizar compra
          </Button>
          <Box>
            <Text fontWeight="bold" fontSize="lg" color="green.700">
              Subtotal: R$ {getSubtotal().toFixed(2)}
            </Text>
            {desconto > 0 && (
              <Text fontWeight="bold" fontSize="md" color="red.500">
                Desconto: -R$ {desconto.toFixed(2)}
              </Text>
            )}
            <Text fontWeight="bold" fontSize="lg" color="green.700">
              Total: R$ {getTotal().toFixed(2)}
            </Text>
          </Box>
          <Flex direction="column" align="center" gap={2}>
            <Text fontWeight="bold" fontSize="lg" color="black">
              INSERIR CUPOM:
            </Text>
            {cupomAplicado ? (
              <Flex direction="column" align="center" gap={2}>
                <Text color="green.600" fontWeight="bold">
                  Cupom "{cupomAplicado.code}" aplicado!
                </Text>
                <Button
                  bg={'red'}
                  color={'white'}
                  fontWeight={'bold'}
                  onClick={handleRemoverCupom}
                  size="sm"
                >
                  Remover Cupom
                </Button>
              </Flex>
            ) : (
              <Flex align="center" gap={2}>
                <Input 
                  color={'black'}
                  placeholder="Cupom de desconto" 
                  width="200px"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                />
                <Button
                  bg={'blue'}
                  color={'white'}
                  fontWeight={'bold'}
                  onClick={handleVerificarCupom}
                  size="md"
                >
                  Aplicar
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      )}    
    </Box>
  );
}