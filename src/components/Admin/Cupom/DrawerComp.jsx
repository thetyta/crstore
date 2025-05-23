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
              Editar Cupom
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Código
              <Input
                value={inputEdit.code}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, code: e.target.value })
                }
              />
              Tipo
              <Input
                value={inputEdit.type}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, type: e.target.value })
                }
              />
              Valor
              <Input
                type="number"
                value={inputEdit.value}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, value: e.target.value })
                }
              />
              Usos
              <Input
                type="number"
                value={inputEdit.uses}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, uses: e.target.value })
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