'use client';
import {
  Table,
  Button,
  Stack
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export default function TableCRUD({
  tasks,
  onDelete,
  onEdit,
  headers
}) {
  return (
    <Table.Root width="50%" size="sm" variant="outline">
      <Table.Header>
        <Table.Row>
          {headers.map((header, i) => (
            <Table.ColumnHeader key={i}>{header.name}</Table.ColumnHeader>
          ))}
          <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((cargo) => (
          <Table.Row key={cargo.id}>
            {headers.map((header, i) => (
              <Table.Cell key={i}>
                {header.value === "estudante"
                  ? cargo[header.value]
                    ? "Sim"
                    : "Não"
                  : typeof cargo[header.value] === 'object' && cargo[header.value] !== null
                  ? JSON.stringify(cargo[header.value]) // Converte o objeto para string legível
                  : cargo[header.value]}
              </Table.Cell>
            ))}
            <Table.Cell textAlign="end">
              <Stack direction="row" justify="end">
                <Button
                  background="red"
                  variant="subtle"
                  color="white"
                  size="xs"
                  onClick={() => onDelete(cargo.id)}
                >
                  <MdDelete />
                </Button>
                <Button
                  background="grey"
                  variant="subtle"
                  color="white"
                  size="xs"
                  onClick={() => onEdit(cargo.id, cargo)}
                >
                  <FaEdit />
                </Button>
              </Stack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}