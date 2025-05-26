'use client'
import { useEffect, useState } from "react";
import { Box, Heading, Text, Image, Stack, Button, Flex, IconButton } from "@chakra-ui/react";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { CiCirclePlus, CiCircleMinus,   } from "react-icons/ci";

export default function CarrinhoPage() {
  const [cart, setCart] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  function getProduct(id) {
    return produtos.find(p => p.id === id);
  }

  // Atualiza a quantidade de um item
  const handleUpdateQuantity = async (idProduct, newQuantity) => {
    console.log((newQuantity));
    
    if (newQuantity < 1) return;
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
      // Atualiza o carrinho local
      setCart(cart => cart.filter(item => item.idProduct !== idProduct));
      // Recarrega do backend
      const res = await api.get("/usuario/info", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.resposta.cart || []);
    } catch (err) {
      // Trate o erro se quiser
    }
  };

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
                      onClick={() => handleUpdateQuantity(item.idProduct, item.quantity - 1)}
                      isDisabled={item.quantity <= 1}
                      mr={2}
                      variant="outline"
                      bg="#a30c02"
                      borderColor="gray.300"
                      _hover={{ bg: "gray.100" }}
                    ><CiCircleMinus color="white" /> </IconButton>
                    <Text mx={2} color={"black"}>{item.quantity}</Text>
                    <IconButton
                      size="sm"
                      aria-label="Aumentar"
                      onClick={() => handleUpdateQuantity(item.idProduct, item.quantity + 1)}
                      mr={2}
                      variant="outline"
                      bg="green"
                      borderColor="gray.300"
                      _hover={{ bg: "gray.100" }}
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
                    Preço: R$ {prod?.price}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}