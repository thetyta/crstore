"use client";
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import { IoAddCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";

export default function Dialogo({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (open) {
      api.get("/categoria")
        .then(res => setCategorias(res.data.data || []))
        .catch(() => setCategorias([]));
    }
  }, [open]);

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
                <Dialog.Title>Criar Produto</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Nome
                <Input
                  placeholder="Nome"
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                />
                Descrição
                <Input
                  placeholder="Descrição"
                  value={input.description}
                  onChange={(e) => setInput({ ...input, description: e.target.value })}
                />
                Preço
                <Input
                  placeholder="Preço"
                  type="number"
                  value={input.price}
                  onChange={(e) => setInput({ ...input, price: e.target.value })}
                />
                Imagem (URL)
                <Input
                  placeholder="URL da Imagem"
                  value={input.imageURL}
                  onChange={(e) => setInput({ ...input, imageURL: e.target.value })}
                />
                Categoria
                <select
                  value={input.idCategory}
                  onChange={e => setInput({ ...input, idCategory: e.target.value })}
                  style={{
                    height: "40px",
                    borderRadius: "8px",
                    padding: "0 8px",
                    background: "#1a202c",
                    color: "white",
                    border: "1px solid #2d3748"
                  }}
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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