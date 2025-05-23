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

export default function Dialogue({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
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
                <Dialog.Title>Criar Cupom</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Código
                <Input
                  placeholder="Código"
                  value={input.code}
                  onChange={(e) => setInput({ ...input, code: e.target.value })}
                />
                Tipo
                <select
                  value={input.type}
                  onChange={(e) => setInput({ ...input, type: e.target.value })}
                  style={{ height: "40px", borderRadius: "8px", padding: "0 8px" }}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="porcentagem">Porcentagem</option>
                  <option value="valor">Valor</option>
                </select>
                Valor
                <Input
                  placeholder="Valor"
                  type="number"
                  value={input.value}
                  onChange={(e) => setInput({ ...input, value: e.target.value })}
                />
                Usos
                <Input
                  placeholder="Quantidade de usos"
                  type="number"
                  value={input.uses}
                  onChange={(e) => setInput({ ...input, uses: e.target.value })}
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