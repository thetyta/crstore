import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function PaymentCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  // CRIAR PAGAMENTO
  const criarItem = async ({ input, setInput }) => {
    if (!input.name) {
      toaster.create({ title: 'Preencha o nome do método de pagamento', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-pagamento', {
        name: input.name,
      });
      await fetchData();
      setInput({ name: '' });
      toaster.create({ title: 'Método de pagamento criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar método de pagamento: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  // EDITAR PAGAMENTO
  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.name && inputEdit.name !== task.name) updatedData.name = inputEdit.name;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.patch(`/criar-pagamento/${id}`, updatedData);
      await fetchData();
      setInputEdit({ name: '' });
      setOpen?.(false);
      toaster.create({ title: 'Método de pagamento atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar método de pagamento: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar método de pagamento:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // EXCLUIR PAGAMENTO
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este método de pagamento?')) {
        await api.delete(`/deletar-pagamento/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Método de pagamento deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar método de pagamento: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}