import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function ProductCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  // CRIAR PRODUTO
  const criarItem = async ({ input, setInput }) => {
    if (!input.name || !input.price || !input.idCategory) {
      toaster.create({ title: 'Preencha nome, preço e categoria', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-produto', {
        name: input.name,
        description: input.description,
        price: input.price,
        imageURL: input.imageURL,
        idCategory: input.idCategory,
      });
      await fetchData();
      setInput({
        name: '',
        description: '',
        price: '',
        imageURL: '',
        idCategory: '',
      });
      toaster.create({ title: 'Produto criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar produto: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  // EDITAR PRODUTO
  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.name && inputEdit.name !== task.name) updatedData.name = inputEdit.name;
    if (inputEdit.description && inputEdit.description !== task.description) updatedData.description = inputEdit.description;
    if (inputEdit.price && inputEdit.price !== task.price) updatedData.price = inputEdit.price;
    if (inputEdit.imageURL && inputEdit.imageURL !== task.imageURL) updatedData.imageURL = inputEdit.imageURL;
    if (inputEdit.idCategory && inputEdit.idCategory !== task.idCategory) updatedData.idCategory = inputEdit.idCategory;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.patch(`/criar-produto/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        name: '',
        description: '',
        price: '',
        imageURL: '',
        idCategory: '',
      });
      setOpen?.(false);
      toaster.create({ title: 'Produto atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar produto: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar produto:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // EXCLUIR PRODUTO
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este produto?')) {
        await api.delete(`/deletar-produto/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Produto deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar produto: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}