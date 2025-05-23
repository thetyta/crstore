'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TableCRUD from '@/components/Admin/Table';
import PaginationDoida from '@/components/Admin/Pagination';
import DrawerComp from '@/components/Admin/Product/DrawerComp';
import Dialogo from '@/components/Admin/Product/Dialogue';
import ItemsPorPag from '@/components/Admin/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import ProductCrud from '@/components/Admin/CRUDS/ProductCrud';

export default function Produtos() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: '',
    idCategory: '',
  });
  const [inputEdit, setInputEdit] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: '',
    idCategory: '',
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);
  const [searchField, setSearchField] = useState('name');

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/produto');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar produtos', type: 'error' });
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const {
    criarItem,
    editarItem,
    excluirItem,  
    loadingSave,
  } = ProductCrud({
    fetchData: buscarProdutos,
    setOpen: setIsEditOpen,
  });

    const itemsFiltradas = items.filter(item => {
    if (!searchTerm) return true;
    if (searchField === "id") {
      return item.id?.toString().includes(searchTerm);
    }
        if (searchField === "idCategory") {
      return item.idCategory?.toString().includes(searchTerm);
    }
    return item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const itemsAtuais = itemsFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Produtos</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={20}>
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          style={{ width: "150px", height: "40px", borderRadius: "8px", padding: "0 8px" }}
        >
          <option value="name">Nome</option>
          <option value="description">Descrição</option>
          <option value="id">ID</option>
          <option value="idCategory">ID Categoria</option>
        </select>
        <Input
          placeholder={`Pesquise por ${
            searchField === 'name'
              ? 'nome'
              : searchField === 'description'
              ? 'descrição'
              : searchField === 'id'
              ? 'ID'
              : 'ID Categoria'
          }`}
          variant="subtle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        <Dialogo
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
            { name: 'Nome', value: 'name' },
            { name: 'Descrição', value: 'description' },
            { name: 'Preço', value: 'price' },
            { name: 'Imagem', value: 'imageURL' },
            { name: 'Categoria', value: 'idCategory' },
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