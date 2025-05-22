'use client';
import { Portal, Drawer, Input, Button } from "@chakra-ui/react";

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
            <Drawer.Header>Editar Endereço</Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Rua
              <Input value={inputEdit.street} onChange={e => setInputEdit({ ...inputEdit, street: e.target.value })} />
              Número
              <Input value={inputEdit.number} onChange={e => setInputEdit({ ...inputEdit, number: e.target.value })} />
              Bairro
              <Input value={inputEdit.neighborhood} onChange={e => setInputEdit({ ...inputEdit, neighborhood: e.target.value })} />
              Cidade
              <Input value={inputEdit.city} onChange={e => setInputEdit({ ...inputEdit, city: e.target.value })} />
              Estado
              <Input value={inputEdit.state} onChange={e => setInputEdit({ ...inputEdit, state: e.target.value })} />
              CEP
              <Input value={inputEdit.zipCode} onChange={e => setInputEdit({ ...inputEdit, zipCode: e.target.value })} />
              ID do Usuário
              <Input value={inputEdit.idUser} onChange={e => setInputEdit({ ...inputEdit, idUser: e.target.value })} />
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" mr={3} onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={editarTask} isLoading={loadingSave} loadingText="Salvando" background="green" color="white">Salvar</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Portal>
  );
}