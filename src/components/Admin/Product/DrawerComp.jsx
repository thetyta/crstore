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
              Editar Produto
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Nome
              <Input
                value={inputEdit.name}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, name: e.target.value })
                }
              />
              Descrição
              <Input
                value={inputEdit.description}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, description: e.target.value })
                }
              />
              Preço
              <Input
                type="number"
                value={inputEdit.price}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, price: e.target.value })
                }
              />
              Imagem (URL)
              <Input
                value={inputEdit.imageURL}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, imageURL: e.target.value })
                }
              />
              Categoria (ID)
              <Input
                value={inputEdit.idCategory}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, idCategory: e.target.value })
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