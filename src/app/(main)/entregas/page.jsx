'use client'
import { Box, Heading, Text, Stack, Flex, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { toaster } from "@/components/ui/toaster"; 
import { Dialog, Portal, Input } from "@chakra-ui/react";

export default function EntregasPage() {
  const [pedidos, setPedidos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pedidoEdit, setPedidoEdit] = useState(null);
  const [statusEdit, setStatusEdit] = useState("");

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const userRes = await api.get("/usuario/info");
        const id = userRes.data?.resposta?.id;
        setUserId(id);

        const resPedidos = await api.get("/pedido");
        // Filtra apenas os pedidos do entregador que NÃO estão entregues/cancelados
        const pedidosDoEntregador = (resPedidos.data.data || []).filter(
          pedido =>
            pedido.idUserDelivery === id &&
            pedido.status !== "delivered" &&
            pedido.status !== "canceled"
        );
        setPedidos(pedidosDoEntregador);
      } catch {
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  const handleOpenDialog = (pedido) => {
    setPedidoEdit(pedido);
    setStatusEdit(pedido.status);
    setDialogOpen(true);
  };

  const handleSalvar = async () => {
    // Se o status for delivered ou canceled, pede confirmação
    if (statusEdit === "delivered" || statusEdit === "canceled") {
      const confirmMsg =
        statusEdit === "delivered"
          ? "Tem certeza que deseja marcar este pedido como ENTREGUE? Essa ação não pode ser desfeita."
          : "Tem certeza que deseja CANCELAR este pedido? Essa ação não pode ser desfeita.";
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }
    try {
      await api.patch(`/criar-pedido/${pedidoEdit.id}`, {
        status: statusEdit,
      });
      toaster.create({ title: "Pedido atualizado!", type: "success" });
      setDialogOpen(false);
      const resPedidos = await api.get("/pedido");
      const pedidosAtualizados = (resPedidos.data.data || []).filter(
        pedido =>
          pedido.idUserDelivery === userId &&
          pedido.status !== "delivered" &&
          pedido.status !== "canceled"
      );
      setPedidos(pedidosAtualizados);
    } catch (err) {
      toaster.create({ title: "Erro ao atualizar pedido", type: "error" });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md" bg="gray.50">
      <Heading mb={4} color={'black'} fontWeight={'bold'}>Minhas Entregas</Heading>
      {loading ? (
        <Text>Carregando...</Text>
      ) : pedidos.length === 0 ? (
        <Text color="gray.700">Nenhuma entrega encontrada.</Text>
      ) : (
        <Stack spacing={4}>
          {pedidos.map((pedido) => (
            <Box key={pedido.id} borderWidth={1} borderRadius="md" p={4} bg="white">
              <Text color="black" fontWeight="bold">Pedido #{pedido.id}</Text>
              <Text color="gray.700">Status: {pedido.status}</Text>
              <Text color="gray.700">Cliente: {pedido.cliente_nome}</Text>
              <Text color="gray.700">Total: R$ {pedido.totalPrice}</Text>
              <Flex>
                <Button onClick={() => handleOpenDialog(pedido)}>
                  Alterar detalhes do pedido
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* Dialogue para editar status */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Alterar Status do Pedido</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                <Text>ID do Pedido: {pedidoEdit?.id}</Text>
                <Text>Cliente: {pedidoEdit?.cliente_nome}</Text>
                <Text>Total: R$ {pedidoEdit?.totalPrice}</Text>
                <label>Status</label>
                <select
                  value={statusEdit}
                  onChange={e => setStatusEdit(e.target.value)}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="pending">Pendente</option>
                  <option value="preparing">Preparando</option>
                  <option value="delivering">Em entrega</option>
                  <option value="delivered">Entregue</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" mr={3} onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button background="green" color="white" onClick={handleSalvar}>
                  Salvar
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}