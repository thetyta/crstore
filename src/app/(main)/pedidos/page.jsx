'use client'
import { useEffect, useState } from "react";
import { Box, Heading, Text, Stack, Flex, Separator, Input, Button } from "@chakra-ui/react";
import { api } from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('id');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const userRes = await api.get("/usuario/info");
        const id = userRes.data?.resposta?.id;
        setUserId(id);
        setUserRole(userRes.data?.resposta?.role);

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
    if (status === "canceled") return "red";
    return "gray.600";
  }

  async function handlePegarPedido(pedidoId) {
    try {
      await api.patch(`/criar-pedido/${pedidoId}`, {
        idUserDelivery: userId,
      });
      toaster.create({ title: "Pedido atribuído a você!", type: "success" });
      const resPedidos = await api.get("/pedido");
      setPedidos(resPedidos.data.data || []);
    } catch (err) {
      toaster.create({ title: "Erro ao pegar pedido", type: "error" });
    }
  }

  const statusOrder = {
    pending: 1,
    preparing: 2,
    delivering: 3,
    delivered: 4,
    canceled: 5,
  };

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
            .sort((a, b) => {
              const statusA = statusOrder[a.status] || 99;
              const statusB = statusOrder[b.status] || 99;
              if (statusA !== statusB) return statusA - statusB;
              return new Date(b.created_at) - new Date(a.created_at);
            })
            .filter(pedido => {
              if(userRole === 'user' && pedido.idUserCustomer !== userId) return false;
              const value = searchTerm.toLowerCase();
              if (!value) return true;
              if (searchField === "id") {
                return String(pedido.id).padStart(2, '0').includes(value.padStart(2, '0'));
              }
              if (searchField === "cliente_nome") {
                return pedido.cliente_nome?.toLowerCase().includes(value);
              }
              if (searchField === "status") {
                return pedido.status?.toLowerCase().includes(value);
              }
              return true;
            })
            .map((pedido, idx) => {
              // Adiciona zero à esquerda se id for de um dígito
              const pedidoIdFormatado = String(pedido.id).length === 1
                ? `0${pedido.id}`
                : String(pedido.id);
              return (
                <Box key={pedido.id || idx} p={4} bg="gray.50">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" color={'black'}>
                      Pedido #{pedidoIdFormatado}
                    </Text>
                    <Text color="gray.600">{new Date(pedido.created_at).toLocaleString()}</Text>
                  </Flex>
                  <Separator my={2} />
                  <Text>
                    <span style={{ color: "black" }}>Status: </span>
                    <b style={{ color: getStatusColor(pedido.status) }}>{pedido.status}</b>
                  </Text>
                  
                  {/* Exibir informações de preço com cupom para admin e entregador */}
                  {(userRole === 'admin' || userRole === 'delivery') ? (
                    <>
                      {/* Tenta diferentes possibilidades de campos do cupom */}
                      {(pedido.cupom_code || pedido.idCupom || pedido.cupom || pedido.coupon_code) && (
                        <>
                          <Text>
                            <span style={{ color: "black" }}>Cupom utilizado: </span>
                            <b style={{ color: "blue" }}>
                              {pedido.cupom_code || pedido.coupon_code || `Cupom ID: ${pedido.idCupom || pedido.cupom}`}
                            </b>
                          </Text>
                          <Text>
                            <span style={{ color: "black" }}>Preço antes do desconto: </span>
                            <b style={{ color: "gray.600" }}>
                              R$ {(parseFloat(pedido.totalPrice) + parseFloat(
                                pedido.totalDiscount || 
                                pedido.desconto || 
                                pedido.discount || 
                                pedido.coupon_discount ||
                                0
                              )).toFixed(2)}
                            </b>
                          </Text>
                          <Text>
                            <span style={{ color: "black" }}>Desconto aplicado: </span>
                            <b style={{ color: "red" }}>
                              -R$ {parseFloat(
                                pedido.totalDiscount || 
                                pedido.desconto || 
                                pedido.discount || 
                                pedido.coupon_discount ||
                                0
                              ).toFixed(2)}
                            </b>
                          </Text>
                        </>
                      )}
                      <Text>
                        <span style={{ color: "black" }}>Preço final: </span> 
                        <b style={{ color: "green" }}>R$ {pedido.totalPrice}</b>
                      </Text>
                    </>
                  ) : (
                    <Text>
                      <span style={{ color: "black" }}>Preço total: </span> 
                      <b style={{ color: "green" }}>R$ {pedido.totalPrice}</b>
                    </Text>
                  )}
                  <Text color={'black'}>Cliente: {pedido.cliente_nome}</Text>
                  <Text color={'black'}>Endereço: {pedido.cliente_endereco}</Text>
                  {pedido.idUserDelivery && (
                    <Text color={'black'}>
                      Entregador: {pedido.entregador_nome || "Atribuído"}
                    </Text>
                  )}
                  {pedido.itens && pedido.itens.length > 0 && (
                    <Box mt={2}>
                      <Text fontWeight="bold" color={'black'}>Itens:</Text>
                      <ul>
                        {pedido.itens.map((item, i) => {
                          return (
                            <li key={i} style={{ marginBottom: 8 }}>
                              <b style={{color: 'black'}}>ID: {item.idProduct} - {item.name}</b> 
                              <b style={{color: 'black'}}> - Qtd: {item.quantity}</b>                          
                              {produtos && (
                                <>
                                  <Text>
                                    <span style={{color: 'black', fontWeight: 'bold'}}>Preço unitário:</span> 
                                    <span style={{color: 'green'}}> R$ {item.price}</span>
                                    {item.quantity > 1 && (
                                      <>
                                      <span style={{color: 'black', fontWeight: 'bold'}}> - Preço total:</span>
                                      <span style={{color: 'green'}}> R$ {item.price * item.quantity}</span>
                                      </>
                                    )}
                                    </Text>
                                  {item.description && (
                                    <Text fontSize="sm" color="gray.600">{item.description}</Text>
                                  )}
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      {(userRole === 'admin' || userRole === 'delivery') && (!pedido.idUserDelivery) && (
                        <Flex justify="flex-end">
                          <Button
                            color={'white'}
                            onClick={() => handlePegarPedido(pedido.id)}
                            isDisabled={pedido.idUserDelivery}
                            bg={'red'}
                          >
                            {pedido.status === "delivering" || pedido.status === "delivered"
                              ? "Já em entrega"
                              : "Pegar pedido"}
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  )}
                </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}