import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function UserCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.name || !input.email || !input.cpf || !input.phone || !input.password || !input.role || !input.username) {
      toaster.create({ title: 'Preencha todos os campos corretamente', type: 'error', duration: 3000 });
      return;
    }
    if (input.cpf.length < 11) {
      toaster.create({ title: 'CPF inválido', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-usuario', {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        password: input.password,
        role: input.role? input.role : 'user',
        username: input.username,
        phone: input.phone,
      });
      await fetchData();
      setInput({
        name: '',
        email: '',
        cpf: '',
        password: '',
        role: '',
        username: '',
        phone: '',
      });
      toaster.create({ title: 'Usuário criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar usuário: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
      
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
  
    if (inputEdit.name && inputEdit.name !== task.name) updatedData.name = inputEdit.name;
    if (inputEdit.email && inputEdit.email !== task.email) updatedData.email = inputEdit.email;
    if (inputEdit.cpf && inputEdit.cpf !== task.cpf) updatedData.cpf = inputEdit.cpf;
    if (inputEdit.role && inputEdit.role !== task.role) updatedData.role = inputEdit.role;
    if (inputEdit.username && inputEdit.username !== task.username) updatedData.username = inputEdit.username;
    if (inputEdit.phone && inputEdit.phone !== task.phone) updatedData.phone = inputEdit.phone;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }
  
    try {
      setLoadingSave(true);
      await api.patch(`/criar-usuario/${id}`, updatedData);
      await fetchData();
      setInputEdit({
      name: '',
      email: '',
      cpf: '',
      role: '',
      username: '',
      phone: '',
    });
      setOpen?.(false);
      toaster.create({ title: 'Usuário atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar usuário: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este item?')) {
        await api.delete(`/deletar-usuario/${id}`);
        
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);
  
        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }
  
        toaster.create({ title: 'Deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}