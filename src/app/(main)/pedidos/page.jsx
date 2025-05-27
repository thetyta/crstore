'use client'
import { useEffect, useState } from "react";
import { Box, Heading, Text, Stack, Flex, Separator } from "@chakra-ui/react";
import { api } from "@/utils/axios";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const token = localStorage.getItem("token");
        const [resPedidos, resUsuarios, resProdutos] = await Promise.all([
          api.get("/pedido", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/usuario", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/produto", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setPedidos(resPedidos.data.data || []);
        setUsuarios(resUsuarios.data.data || []);
        setProdutos(resProdutos.data.data || []);
      } catch {
        setPedidos([]);
        setUsuarios([]);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  function getNomeCliente(id) {
    const user = usuarios.find(u => u.id === id);
    return user ? user.name : id;
  }

  function getStatusColor(status) {
    if (status === "pending") return "#fc6203";
    if (status === "preparing" || status === "delivering") return "#e8c200";
    if (status === "delivered") return "green";
    return "gray.600";
  }

  function getProdutoInfo(id) {
    return produtos.find(p => p.id === id);
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={4}>
      <Heading mb={6}>Todos os Pedidos</Heading>
      {loading ? (
        <Text>Carregando...</Text>
      ) : pedidos.length === 0 ? (
        <Text>Nenhum pedido encontrado.</Text>
      ) : (
        <Stack spacing={6}>
          {pedidos.map((pedido, idx) => (
            <Box key={pedido.id || idx} borderWidth={1} borderRadius="md" p={4} bg="gray.50">
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold" color={'black'}>Pedido #{pedido.id}</Text>
                <Text color="gray.600">{new Date(pedido.created_at).toLocaleString()}</Text>
              </Flex>
              <Separator my={2} />
              <Text>
                <span style={{ color: "black" }}>Status: </span>
                <b style={{ color: getStatusColor(pedido.status) }}>{pedido.status}</b>
              </Text>
              <Text>Preço total: <b>{pedido.totalPrice}</b></Text>
              <Text>Cliente: {getNomeCliente(pedido.idUserCustomer)}</Text>
              {pedido.itens && pedido.itens.length > 0 && (
                <Box mt={2}>
                  <Text fontWeight="bold">Itens:</Text>
                  <ul>
                    {pedido.itens.map((item, i) => {
                      const produto = getProdutoInfo(item.idProduct || item.idProduto);
                      return (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <b>{produto?.name || item.nome || item.name}</b> - Qtd: {item.quantidade || item.quantity}
                          {produto && (
                            <>
                              <br />
                              Preço: R$ {produto.price}
                              {produto.imageURL && (
                                <img
                                  src={produto.imageURL}
                                  alt={produto.name}
                                  style={{ width: 40, display: "inline-block", verticalAlign: "middle", marginLeft: 8 }}
                                />
                              )}
                              {produto.description && (
                                <Text fontSize="sm" color="gray.600">{produto.description}</Text>
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}