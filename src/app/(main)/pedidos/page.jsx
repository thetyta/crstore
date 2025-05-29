'use client'
import { useEffect, useState } from "react";
import { Box, Heading, Text, Stack, Flex, Separator, Input } from "@chakra-ui/react";
import { api } from "@/utils/axios";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('id');

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const [resPedidos, resProdutos] = await Promise.all([
          api.get("/pedido"),
          api.get("/produto"),
        ]);
        setPedidos(resPedidos.data.data || []);
        setProdutos(resProdutos.data.data || []);
      } catch {
        setPedidos([]);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

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
          <Box>
            <select
              value={searchField}
              onChange={e => setSearchField(e.target.value)}
              style={{ width: "180px", height: "40px", borderRadius: "8px", padding: "0 8px" }}
            >
              <option value="id">ID do Pedido</option>
              <option value="cliente_nome">Nome do Cliente</option>
              <option value="status">Status</option>
            </select>
            <Input
              placeholder={`Pesquise por ${
                searchField === 'id'
                  ? 'ID do pedido'
                  : searchField === 'cliente_nome'
                  ? 'nome do cliente'
                  : 'status'
              }`}
              variant="subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="300px"
              ml={4}
            />
          </Box>
          {pedidos
            .slice()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter(pedido => {
              const value = searchTerm.toLowerCase();
              if (!value) return true;
              if (searchField === "id") {
                return String(pedido.id).includes(value);
              }
              if (searchField === "cliente_nome") {
                return pedido.cliente_nome?.toLowerCase().includes(value);
              }
              if (searchField === "status") {
                return pedido.status?.toLowerCase().includes(value);
              }
              return true;
            })
            .map((pedido, idx) => (
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
                <Text>
                  <span style={{ color: "black" }}>Preço total: </span> 
                  <b style={{ color: "green" }}>R$ {pedido.totalPrice}</b>
                </Text>
                <Text color={'black'}>Cliente: {pedido.cliente_nome}</Text>
                <Text color={'black'}>Endereço: {pedido.cliente_endereco}</Text>
                {pedido.itens && pedido.itens.length > 0 && (
                  <Box mt={2}>
                    <Text fontWeight="bold" color={'black'}>Itens:</Text>
                    <ul>
                      {pedido.itens.map((item, i) => {
                        const produto = getProdutoInfo(item.idProduct);
                        return (
                          <li key={i} style={{ marginBottom: 8 }}>
                            <b style={{color: 'black'}}>ID: {item.idProduct} - {item.name}</b> 
                            <b style={{color: 'black'}}> - Qtd: {item.quantity}</b>                          
                            {produto && (
                              <>
                                Preço: R$ {produto.price}
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