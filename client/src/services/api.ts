import axios from 'axios';
import { Supplier } from '../types/supplier';

// Use the Cloudflare endpoint
const API_URL = process.env.REACT_APP_API_URL || 'https://www.mixtech.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      throw error;
    }
  }
);

export const supplierApi = {
  createSupplier: async (formData: FormData) => {
    try {
      const response = await api.post('/suppliers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
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