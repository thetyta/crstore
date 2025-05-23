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
import DrawerComp from '@/components/Admin/Cupom/DrawerComp';
import Dialogue from '@/components/Admin/Cupom/Dialogue';
import ItemsPorPag from '@/components/Admin/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import CupomCrud from '@/components/Admin/CRUDS/CupomCrud';

export default function Cupoms() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    code: '',
    type: '',
    value: '',
    uses: 1,
  });
  const [inputEdit, setInputEdit] = useState({
    code: '',
    type: '',
    value: '',
    uses: 1,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);
  const [searchField, setSearchField] = useState('code');

  const buscarCupoms = async () => {
    try {
      const response = await api.get('/cupom');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar cupons', type: 'error' });
    }
  };

  useEffect(() => {
    buscarCupoms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  const {
    criarItem,
    editarItem,
    excluirItem,  
    loadingSave,
  } = CupomCrud({
    fetchData: buscarCupoms,
    setOpen: setIsEditOpen,
  });

  const itemsFiltradas = items.filter(item => {
    if (!searchTerm) return true;
    if (searchField === "id") {
      return item.id?.toString().includes(searchTerm);
    }
    return item[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const itemsAtuais = itemsFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Cupons</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={20}>
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          style={{ width: "150px", height: "40px", borderRadius: "8px", padding: "0 8px" }}
        >
          <option value="code">Código</option>
          <option value="type">Tipo</option>
          <option value="value">Valor</option>
          <option value="uses">Usos</option>
          <option value="id">ID</option>
        </select>
        <Input
          placeholder={`Pesquise por ${
            searchField === 'code'
              ? 'código'
              : searchField === 'type'
              ? 'tipo'
              : searchField === 'value'
              ? 'valor'
              : searchField === 'uses'
              ? 'usos'
              : 'ID'
          }`}
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
            { name: 'Código', value: 'code' },
            { name: 'Tipo', value: 'type' },
            { name: 'Valor', value: 'value' },
            { name: 'Usos', value: 'uses' },
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