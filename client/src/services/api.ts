import axios from 'axios';
import { Supplier } from '../types/supplier';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const supplierApi = {
  createSupplier: async (supplier: Omit<Supplier, '_id'>) => {
    const response = await api.post<Supplier>('/suppliers', supplier);
    return response.data;
  },

  getSuppliers: async () => {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  },

  getSupplierById: async (id: string) => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  updateSupplier: async (id: string, supplier: Partial<Supplier>) => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, supplier);
    return response.data;
  },

  deleteSupplier: async (id: string) => {
    await api.delete(`/suppliers/${id}`);
  },
};

export default api; 