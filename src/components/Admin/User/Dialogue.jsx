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

export default function Dialogo({
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
                <Dialog.Title>Criar Usuário</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Nome
                <Input
                placeholder="Nome"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                />
                Email
                <Input
                placeholder="Email"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                />
                Senha
                <Input
                placeholder="Senha"
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                />
                CPF
                <Input
                placeholder="CPF"
                value={input.cpf}
                onChange={(e) => setInput({ ...input, cpf: e.target.value })}
                />
                Usuário
                <Input
                placeholder="Usuário"
                value={input.username}
                onChange={(e) => setInput({ ...input, username: e.target.value })}
                />
                Telefone
                <Input
                placeholder="Telefone"
                value={input.phone}
                onChange={(e) => setInput({ ...input, phone: e.target.value })}
                />
                Cargo
                <Input
                placeholder="Cargo"
                value={input.role}
                onChange={(e) => setInput({ ...input, role: e.target.value })}
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