'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Stack,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import TableCRUD from '@/components/Admin/Table';
import PaginationDoida from '@/components/Admin/Pagination';
import DrawerComp from '@/components/Admin/Address/DrawerComp';
import Dialogue from '@/components/Admin/Address/Dialogue';
import ItemsPorPag from '@/components/Admin/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import AddressCrud from '@/components/Admin/CRUDS/AddressCrud';

export default function Enderecos() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', idUser: ''
  });
  const [inputEdit, setInputEdit] = useState({
    street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', idUser: ''
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('street');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);

  const buscarEnderecos = async () => {
    try {
      const response = await api.get('/endereco');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar endereços', type: 'error' });
    }
  };

  useEffect(() => {
    buscarEnderecos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  const {
    criarItem,
    editarItem,
    excluirItem,  
    loadingSave,
  } = AddressCrud({
    fetchData: buscarEnderecos,
    setOpen: setIsEditOpen,
  });

  const itemsFiltradas = items.filter(item => {
    if (!searchTerm) return true;
    if (searchField === "id") {
      return item.id?.toString().includes(searchTerm);
    }
    return item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const itemsAtuais = itemsFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Endereços</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={4}>
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          style={{ width: "150px", height: "40px", borderRadius: "8px", padding: "0 8px" }}
        >
          <option value="street">Rua</option>
          <option value="city">Cidade</option>
          <option value="neighborhood">Bairro</option>
          <option value="id">ID</option>
        </select>
        <Input
          placeholder={`Pesquise por ${{
            street: "rua",
            city: "cidade",
            neighborhood: "bairro",
            id: "ID"
          }[searchField]}`}
          variant="subtle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        <Dialogue
          input={input}
          setInput={setInput}
          submit={() => criarItem({ input, setInput })}
          open={isCreateOpen}
          setOpen={setIsCreateOpen}
          loadingSave={loadingSave}
        />
      </Flex>

      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TableCRUD
          tasks={itemsAtuais}
          onDelete={(id) =>
            excluirItem({
              id,
              items,
              setItems,
              currentPage,
              itemsPerPage,
              setCurrentPage,
            })
          }
          onEdit={(id, task) => {
            setIdEdit(id);
            setInputEdit(task);      
            setTaskEditOriginal(task);
            setIsEditOpen(true);
          }}
          headers={[
            { name: 'ID', value: 'id' },
            { name: 'Rua', value: 'street' },
            { name: 'Número', value: 'number' },
            { name: 'Bairro', value: 'neighborhood' },
            { name: 'Cidade', value: 'city' },
            { name: 'Estado', value: 'state' },
            { name: 'CEP', value: 'zipCode' },
            { name: 'Usuário', value: 'idUser' },
          ]}
        />

        <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
          <PaginationDoida
            items={itemsFiltradas}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
          <ItemsPorPag
            value={value}
            setValue={setValue}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </Flex>
      </Stack>

      <DrawerComp
        editarTask={() =>
          editarItem({
            id: idEdit,
            inputEdit,
            setInputEdit,
            task: taskEditOriginal,
          })
        }
        inputEdit={inputEdit}
        setInputEdit={setInputEdit}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        loadingSave={loadingSave}
        idEdit={idEdit}
      />
    </Box>
  );
}