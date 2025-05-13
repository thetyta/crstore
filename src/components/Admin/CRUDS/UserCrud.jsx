import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function UserCrud({ endpoint, fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.nome || !input.email || !input.cpf || !input.estudante || !input.password) {
      toaster.create({ title: 'Preencha todos os campos corretamente', type: 'error', duration: 3000 });
      return;
    }
    
    try {
      setLoadingSave(true);
      if (input.estudante === "true") {
        input.estudante = true;
      } else {
        input.estudante = false;
      }
      await api.post(endpoint, {
        nome: input.nome,
        email: input.email,
        cpf: input.cpf,
        estudante: input.estudante,
        password: input.password,
        idCargo: input.idCargo? parseInt(input.idCargo) : null
      });
      console.log("Dados enviados:", {
        nome: input.nome,
        email: input.email,
        cpf: input.cpf,
        estudante: input.estudante,
        password: input.password,
        idCargo: input.idCargo? parseInt(input.idCargo) : null
      });
      await fetchData();
      setInput({
        nome: '',
        email: '',
        cpf: '',
        estudante: '',
        password: '',
        idCargo: ''
      });
      toaster.create({ title: 'Usuário criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar usuário: ${error}`, type: 'error', duration: 3000 });
      console.log("Dados enviados:", {
        nome: input.nome,
        email: input.email,
        cpf: input.cpf,
        estudante: input.estudante,
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
  
    if (inputEdit.nome && inputEdit.nome !== task.nome) updatedData.nome = inputEdit.nome;
    if (inputEdit.email && inputEdit.email !== task.email) updatedData.email = inputEdit.email;
    if (inputEdit.cpf && inputEdit.cpf !== task.cpf) updatedData.cpf = inputEdit.cpf;
    if (inputEdit.idCargo && inputEdit.idCargo !== task.idCargo) updatedData.idCargo = parseInt(inputEdit.idCargo);
    if (inputEdit.estudante === 'true'){
      updatedData.estudante = true;
    } else {
      updatedData.estudante = false;  
    }
  
    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }
  
    try {
      setLoadingSave(true);
  
      await api.patch(`${endpoint}/${id}`, updatedData);
  
      await fetchData();
      setInputEdit({
        nome: '',
        email: '',
        cpf: '',
        estudante: '',
        idCargo: ''
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
        await api.delete(`${endpoint}/${id}`);
        
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);
  
        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }
  
        toaster.create({ title: 'Deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar', type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}