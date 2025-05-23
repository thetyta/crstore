import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function OrderCrud({ fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  // CRIAR PEDIDO
  const criarItem = async ({ input, setInput }) => {
    if (
      !input.idUserCustomer ||
      !input.idPayment ||
      !input.totalPrice ||
      !input.status
    ) {
      toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.post('/criar-pedido', {
        idUserCustomer: input.idUserCustomer,
        idUserDelivery: input.idUserDelivery || null,
        idAddress: input.idAddress || null,
        idPayment: input.idPayment,
        idCupom: input.idCupom || null,
        status: input.status,
        payStatus: input.payStatus || 'pending',
        totalPrice: input.totalPrice,
        totalDiscount: input.totalDiscount || 0,
      });
      await fetchData();
      setInput({
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
      toaster.create({ title: 'Pedido criado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao criar pedido: ${error}`, type: 'error', duration: 3000 });
      console.log(`dados enviados: ${JSON.stringify(input)}`);
    } finally {
      setLoadingSave(false);
    }
  };

  // EDITAR PEDIDO
  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
    if (inputEdit.idUserCustomer && inputEdit.idUserCustomer !== task.idUserCustomer) updatedData.idUserCustomer = inputEdit.idUserCustomer;
    if (inputEdit.idUserDelivery !== undefined && inputEdit.idUserDelivery !== task.idUserDelivery) updatedData.idUserDelivery = inputEdit.idUserDelivery;
    if (inputEdit.idAddress !== undefined && inputEdit.idAddress !== task.idAddress) updatedData.idAddress = inputEdit.idAddress;
    if (inputEdit.idPayment && inputEdit.idPayment !== task.idPayment) updatedData.idPayment = inputEdit.idPayment;
    if (inputEdit.idCupom !== undefined && inputEdit.idCupom !== task.idCupom) updatedData.idCupom = inputEdit.idCupom;
    if (inputEdit.status && inputEdit.status !== task.status) updatedData.status = inputEdit.status;
    if (inputEdit.payStatus && inputEdit.payStatus !== task.payStatus) updatedData.payStatus = inputEdit.payStatus;
    if (inputEdit.totalPrice && inputEdit.totalPrice !== task.totalPrice) updatedData.totalPrice = inputEdit.totalPrice;
    if (inputEdit.totalDiscount !== undefined && inputEdit.totalDiscount !== task.totalDiscount) updatedData.totalDiscount = inputEdit.totalDiscount;

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      await api.patch(`/criar-pedido/${id}`, updatedData);
      await fetchData();
      setInputEdit({
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
      setOpen?.(false);
      toaster.create({ title: 'Pedido atualizado com sucesso', type: 'success', duration: 3000 });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar pedido: ${error}`, type: 'error', duration: 3000 });
      console.error("Erro ao atualizar pedido:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // EXCLUIR PEDIDO
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este pedido?')) {
        await api.delete(`/deletar-pedido/${id}`);
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Pedido deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: `Erro ao deletar pedido: ${error}`, type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}