"use client";
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { IoAddCircleOutline } from "react-icons/io5";

export default function Dialogue({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
  const [pagamentos, setPagamentos] = useState([]);
  const [entregadores, setEntregadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [cupoms, setCupoms] = useState([]);

  useEffect(() => {
    if (open) {
      api.get("/pagamento")
        .then(res => setPagamentos(res.data.data || []))
        .catch(() => setPagamentos([]));

      api.get("/usuario")
        .then(res => {
          const data = res.data.data || [];
          setEntregadores(data.filter(u => u.role === "delivery"));
          setClientes(data.filter(u => u.role === "user"));
        })
        .catch(() => {
          setEntregadores([]);
          setClientes([]);
        });

      api.get("/cupom")
        .then(res => setCupoms(res.data.data || []))
        .catch(() => setCupoms([]));
    }
  }, [open]);

  // Buscar endereços do cliente selecionado
  useEffect(() => {
    if (input.idUserCustomer) {
      api.get(`/endereco/${input.idUserCustomer}`)
        .then(res => {
          const data = res.data.data;
          setEnderecos(Array.isArray(data) ? data : data ? [data] : []);
        })
        .catch(() => setEnderecos([]));
    } else {
      setEnderecos([]);
    }
  }, [input.idUserCustomer]);

  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        placement="center"
        motionPreset="slide-in-bottom"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Dialog.Trigger asChild>
          <Button background="green" color="white" rounded="100px">
            <IoAddCircleOutline />
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Criar Pedido</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Cliente
                <select
                  value={input.idUserCustomer || ""}
                  onChange={(e) => setInput({ ...input, idUserCustomer: e.target.value, idAddress: "" })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.name || cliente.nome || cliente.username}
                    </option>
                  ))}
                </select>

                Entregador
                <select
                  value={input.idUserDelivery || ""}
                  onChange={(e) => setInput({ ...input, idUserDelivery: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="">Selecione o entregador</option>
                  {entregadores.map(entregador => (
                    <option key={entregador.id} value={entregador.id}>
                      {entregador.name || entregador.nome || entregador.username}
                    </option>
                  ))}
                </select>

                Endereço
                <select
                  value={input.idAddress || ""}
                  onChange={(e) => setInput({ ...input, idAddress: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                  disabled={!input.idUserCustomer}
                >
                  <option value="">Selecione o endereço</option>
                  {enderecos.map(endereco => (
                    <option key={endereco.id} value={endereco.id}>
                      {endereco.street} {endereco.number ? `, ${endereco.number}` : ""} - {endereco.city}
                    </option>
                  ))}
                </select>

                Pagamento
                <select
                  value={input.idPayment || ""}
                  onChange={(e) => setInput({ ...input, idPayment: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="">Selecione o método de pagamento</option>
                  {pagamentos.map(payment => (
                    <option key={payment.id} value={payment.id}>
                      {payment.name}
                    </option>
                  ))}
                </select>

                Cupom
                <select
                  value={input.idCupom || ""}
                  onChange={(e) => setInput({ ...input, idCupom: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="">Selecione o cupom</option>
                  {cupoms.map(cupom => (
                    <option key={cupom.id} value={cupom.id}>
                      {cupom.code}
                    </option>
                  ))}
                </select>

                Status
                <select
                  value={input.status}
                  onChange={e => setInput({ ...input, status: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="pending">Pendente</option>
                  <option value="preparing">Preparando</option>
                  <option value="delivering">Em entrega</option>
                  <option value="delivered">Entregue</option>
                </select>
                Status do Pagamento
                <select
                  value={input.payStatus}
                  onChange={e => setInput({ ...input, payStatus: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="refunded">Reembolsado</option>
                </select>
                Valor Total
                <Input
                  placeholder="Valor Total"
                  type="number"
                  value={input.totalPrice}
                  onChange={(e) => setInput({ ...input, totalPrice: e.target.value })}
                />
                Desconto Total
                <Input
                  placeholder="Desconto Total"
                  type="number"
                  value={input.totalDiscount}
                  onChange={(e) => setInput({ ...input, totalDiscount: e.target.value })}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button background="red" color="white">
                    Cancelar
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={submit}
                  background="green"
                  color="white"
                  isLoading={loadingSave}
                  loadingText="Salvando"
                >
                  Salvar
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
}