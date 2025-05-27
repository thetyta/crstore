'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
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

  useEffect(() => {
    if (inputEdit.idUserCustomer) {
      api.get(`/endereco/${inputEdit.idUserCustomer}`)
        .then(res => {
          const data = res.data.data;
          setEnderecos(Array.isArray(data) ? data : data ? [data] : []);
        })
        .catch(() => setEnderecos([]));
    } else {
      setEnderecos([]);
    }
  }, [inputEdit.idUserCustomer]);

  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Pedido
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Cliente
              <select
                value={inputEdit.idUserCustomer || ""}
                onChange={e => setInputEdit({ ...inputEdit, idUserCustomer: e.target.value, idAddress: "" })}
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
                value={inputEdit.idUserDelivery || ""}
                onChange={e => setInputEdit({ ...inputEdit, idUserDelivery: e.target.value })}
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
                value={inputEdit.idAddress || ""}
                onChange={e => setInputEdit({ ...inputEdit, idAddress: e.target.value })}
                style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                disabled={!inputEdit.idUserCustomer}
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
                value={inputEdit.idPayment || ""}
                onChange={e => setInputEdit({ ...inputEdit, idPayment: e.target.value })}
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
                value={inputEdit.idCupom || ""}
                onChange={e => setInputEdit({ ...inputEdit, idCupom: e.target.value })}
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
                value={inputEdit.status}
                onChange={e => setInputEdit({ ...inputEdit, status: e.target.value })}
                style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
              >
                <option value="pending">Pendente</option>
                <option value="preparing">Preparando</option>
                <option value="delivering">Em entrega</option>
                <option value="delivered">Entregue</option>
              </select>
              Status do Pagamento
              <select
                value={inputEdit.payStatus}
                onChange={e => setInputEdit({ ...inputEdit, payStatus: e.target.value })}
                style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="refunded">Reembolsado</option>
              </select>
              Valor Total
              <Input
                type="number"
                value={inputEdit.totalPrice}
                onChange={e => setInputEdit({ ...inputEdit, totalPrice: e.target.value })}
              />
              Desconto Total
              <Input
                type="number"
                value={inputEdit.totalDiscount}
                onChange={e => setInputEdit({ ...inputEdit, totalDiscount: e.target.value })}
              />
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={editarTask}
                isLoading={loadingSave}
                loadingText="Salvando"
                background="green"
                color="white"
              >
                Salvar
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Portal>
  );
}