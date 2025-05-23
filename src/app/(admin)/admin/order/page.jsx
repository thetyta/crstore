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
import DrawerComp from '@/components/Admin/Orders/DrawerComp';
import Dialogue from '@/components/Admin/Orders/Dialogue';
import ItemsPorPag from '@/components/Admin/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import OrderCrud from '@/components/Admin/CRUDS/OrderCrud';

export default function Orders() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    idUserCustomer: '',
    idUserDelivery: '',
    idAddress: '',
    idPayment: '',
    idCupom: '',
    status: 'pending',
    payStatus: 'pending',
    totalPrice: '',
    totalDiscount: '',
  });
  const [inputEdit, setInputEdit] = useState({
    idUserCustomer: '',
    idUserDelivery: '',
    idAddress: '',
    idPayment: '',
    idCupom: '',
    status: 'pending',
    payStatus: 'pending',
    totalPrice: '',
    totalDiscount: '',
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);
  const [searchField, setSearchField] = useState('idUserCustomer');

  const buscarOrders = async () => {
    try {
      const response = await api.get('/pedido');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar pedidos', type: 'error' });
    }
  };

  useEffect(() => {
    buscarOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  const {
    criarItem,
    editarItem,
    excluirItem,  
    loadingSave,
  } = OrderCrud({
    fetchData: buscarOrders,
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
      <Heading mb={4}>Pedidos</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={20}>
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          style={{ width: "180px", height: "40px", borderRadius: "8px", padding: "0 8px" }}
        >
          <option value="idUserCustomer">ID Cliente</option>
          <option value="idUserDelivery">ID Entregador</option>
          <option value="idAddress">ID Endereço</option>
          <option value="idPayment">ID Pagamento</option>
          <option value="idCupom">ID Cupom</option>
          <option value="status">Status</option>
          <option value="payStatus">Status Pagamento</option>
          <option value="id">ID Pedido</option>
        </select>
        <Input
          placeholder={`Pesquise por ${
            {
              idUserCustomer: "ID Cliente",
              idUserDelivery: "ID Entregador",
              idAddress: "ID Endereço",
              idPayment: "ID Pagamento",
              idCupom: "ID Cupom",
              status: "Status",
              payStatus: "Status Pagamento",
              id: "ID Pedido"
            }[searchField]
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
            { name: 'Cliente', value: 'idUserCustomer' },
            { name: 'Entregador', value: 'idUserDelivery' },
            { name: 'Endereço', value: 'idAddress' },
            { name: 'Pagamento', value: 'idPayment' },
            { name: 'Cupom', value: 'idCupom' },
            { name: 'Status', value: 'status' },
            { name: 'Status Pagamento', value: 'payStatus' },
            { name: 'Valor Total', value: 'totalPrice' },
            { name: 'Desconto Total', value: 'totalDiscount' },
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