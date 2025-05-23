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
                {header.value.toLowerCase().includes("image") && cargo[header.value] ? (
                  <img
                    src={cargo[header.value]}
                    alt="imagem"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px" }}
                  />
                ) : header.value === "description" && cargo[header.value] ? (
                  <span style={{ wordBreak: "break-word", whiteSpace: "pre-line", maxWidth: "200px", display: "block" }}>
                    {cargo[header.value]}
                  </span>
                ) : (
                  cargo[header.value]
                )}
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