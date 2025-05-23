'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
} from "@chakra-ui/react";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
}) {
  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Pedido
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Cliente (ID)
              <Input
                value={inputEdit.idUserCustomer}
                onChange={e => setInputEdit({ ...inputEdit, idUserCustomer: e.target.value })}
              />
              Entregador (ID)
              <Input
                value={inputEdit.idUserDelivery}
                onChange={e => setInputEdit({ ...inputEdit, idUserDelivery: e.target.value })}
              />
              Endereço (ID)
              <Input
                value={inputEdit.idAddress}
                onChange={e => setInputEdit({ ...inputEdit, idAddress: e.target.value })}
              />
              Pagamento (ID)
              <Input
                value={inputEdit.idPayment}
                onChange={e => setInputEdit({ ...inputEdit, idPayment: e.target.value })}
              />
              Cupom (ID)
              <Input
                value={inputEdit.idCupom}
                onChange={e => setInputEdit({ ...inputEdit, idCupom: e.target.value })}
              />
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