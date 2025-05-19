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
              Editar Usuário
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
                Nome
                <Input
                value={inputEdit.name}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, name: e.target.value })
                }
                />
                Email
                <Input
                value={inputEdit.email}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, email: e.target.value })
                }
                />
                CPF
                <Input
                value={inputEdit.cpf}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, cpf: e.target.value })
                }
                />
                Usuário
                <Input
                value={inputEdit.username}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, username: e.target.value })
                }
                />
                Telefone
                <Input
                value={inputEdit.phone}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, phone: e.target.value })
                }
                />
                Cargo
                <Input
                value={inputEdit.role}
                onChange={(e) =>
                    setInputEdit({ ...inputEdit, role: e.target.value })
                }
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
