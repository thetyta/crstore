import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function CupomCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  // CRIAR CUPOM
  const criarItem = async ({ input, setInput }) => {
    if (!input.code || !input.type || !input.value) {
      toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-cupom', {
        code: input.code,
        type: input.type,
        value: input.value,
        uses: input.uses || 1,
      });
      await fetchData();
      setInput({
        code: '',
        type: '',
        value: '',
        uses: 1,
      });
      toaster.create({ title: 'Cupom criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar cupom: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  // EDITAR CUPOM
  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.code && inputEdit.code !== task.code) updatedData.code = inputEdit.code;
    if (inputEdit.type && inputEdit.type !== task.type) updatedData.type = inputEdit.type;
    if (inputEdit.value && inputEdit.value !== task.value) updatedData.value = inputEdit.value;
    if (
      inputEdit.uses !== undefined &&
      inputEdit.uses !== null &&
      inputEdit.uses !== task.uses
    ) updatedData.uses = inputEdit.uses;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.patch(`/criar-cupom/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        code: '',
        type: '',
        value: '',
        uses: 1,
      });
      setOpen?.(false);
      toaster.create({ title: 'Cupom atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar cupom: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar cupom:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // EXCLUIR CUPOM
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este cupom?')) {
        await api.delete(`/deletar-cupom/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Cupom deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar cupom: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}