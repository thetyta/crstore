import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function CategoryCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.name) {
      toaster.create({ title: 'Preencha o nome da categoria', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-categoria', {
        name: input.name,
      });
      await fetchData();
      setInput({
        name: '',
      });
      toaster.create({ title: 'Categoria criada com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar categoria: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.name && inputEdit.name !== task.name) updatedData.name = inputEdit.name;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.patch(`/criar-categoria/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        name: '',
      });
      setOpen?.(false);
      toaster.create({ title: 'Categoria atualizada com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar categoria: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar categoria:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir esta categoria?')) {
        await api.delete(`/deletar-categoria/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Categoria deletada com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar categoria: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}