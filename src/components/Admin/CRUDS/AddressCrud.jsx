import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function AddressCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);
    
  // CRIAR ENDEREÇO
  const criarItem = async ({ input, setInput }) => {
    if (
      !input.street ||
      !input.neighborhood ||
      !input.city ||
      !input.state ||
      !input.zipCode ||
      !input.idUser
    ) {
      toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-endereco', {
        street: input.street,
        number: input.number,
        neighborhood: input.neighborhood,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        idUser: input.idUser,
      });
      await fetchData();
      setInput({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        idUser: '',
      });
      toaster.create({ title: 'Endereço criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar endereço: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  // EDITAR ENDEREÇO
  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.street && inputEdit.street !== task.street) updatedData.street = inputEdit.street;
    if (inputEdit.number && inputEdit.number !== task.number) updatedData.number = inputEdit.number;
    if (inputEdit.neighborhood && inputEdit.neighborhood !== task.neighborhood) updatedData.neighborhood = inputEdit.neighborhood;
    if (inputEdit.city && inputEdit.city !== task.city) updatedData.city = inputEdit.city;
    if (inputEdit.state && inputEdit.state !== task.state) updatedData.state = inputEdit.state;
    if (inputEdit.zipCode && inputEdit.zipCode !== task.zipCode) updatedData.zipCode = inputEdit.zipCode;
    if (inputEdit.idUser && inputEdit.idUser !== task.idUser) updatedData.idUser = inputEdit.idUser;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      // Só pega o token se estiver no browser
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      await api.patch(`/criar-endereco/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
      setInputEdit({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        idUser: '',
      });
      setOpen?.(false);
      toaster.create({ title: 'Endereço atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Erro desconhecido";
      toaster.create({ title: `Erro ao atualizar endereço: ${msg}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar endereço:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // EXCLUIR ENDEREÇO
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este endereço?')) {
        await api.delete(`/deletar-endereco/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Endereço deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar endereço: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}