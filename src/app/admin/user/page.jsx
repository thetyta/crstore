'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// import TaskTable from '@/components/TaskTable';
// import PaginationDoida from '@/components/PaginationDoida';
// import DrawerComp from '@/components/crudForTask/DrawerComp';
// import Dialogo from '@/components/crudForTask/Dialogue';
// import ItemsPorPag from '@/components/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import TableCRUD from "@/components/Admin/Table";
import UserCrud from "@/components/Admin/CRUDS/UserCrud";


export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState('');
  const [open, setOpen] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);

  const buscarCargo = async () => {
    try {
      const response = await api.get('/cargo');
      setTasks(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar cargos', type: 'error' });
    }
  };

  useEffect(() => {
    buscarCargo();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  } = UserCrud({
    endpoint: '/cargo',
    fetchData: buscarCargo,
    setOpen,
  });

  const tasksFiltradas = tasks.filter(task =>
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskAtuais = tasksFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    return (
        <TableCRUD
            tasks={tasks}
            onDelete={(id) => {excluirItem({id, tasks, setTasks, currentPage, setCurrentPage, itemsPerPage})}}
            onEdit={(id, desc) => {setIdEdit(id); setInputEdit(desc); setOpen(true)}}
            headers={[
                { name: "ID", value: "id" },
                { name: "Username", value: "username" },
                { name: "CPF", value: "cpf" },
                { name: "Nome", value: "name" },
                { name: "Email", value: "email" },
                { name: "Telefone", value: "phone" },
                { name: "Celular", value: "phone" },
                { name: "Cargo", value: "role" },
                { name: "Data de Criação", value: "createdAt" },
                { name: "Data de Atualização", value: "updatedAt" }
            ]}
        />
    )
}