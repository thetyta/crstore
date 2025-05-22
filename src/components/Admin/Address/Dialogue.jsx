"use client";
import { Button, CloseButton, Dialog, HStack, Input, Portal } from "@chakra-ui/react";
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
      <Dialog.Root placement="center" motionPreset="slide-in-bottom" open={open} onOpenChange={e => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <Button background="green" color="white" rounded="100px"><IoAddCircleOutline /></Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Criar Endereço</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Rua
                <Input placeholder="Rua" value={input.street} onChange={e => setInput({ ...input, street: e.target.value })} />
                Número
                <Input placeholder="Número" value={input.number} onChange={e => setInput({ ...input, number: e.target.value })} />
                Bairro
                <Input placeholder="Bairro" value={input.neighborhood} onChange={e => setInput({ ...input, neighborhood: e.target.value })} />
                Cidade
                <Input placeholder="Cidade" value={input.city} onChange={e => setInput({ ...input, city: e.target.value })} />
                Estado
                <Input placeholder="Estado" value={input.state} onChange={e => setInput({ ...input, state: e.target.value })} />
                CEP
                <Input placeholder="CEP" value={input.zipCode} onChange={e => setInput({ ...input, zipCode: e.target.value })} />
                ID do Usuário
                <Input placeholder="ID do Usuário" value={input.idUser} onChange={e => setInput({ ...input, idUser: e.target.value })} />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button background="red" color="white">Cancelar</Button>
                </Dialog.ActionTrigger>
                <Button onClick={submit} background="green" color="white" isLoading={loadingSave} loadingText="Salvando">Salvar</Button>
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