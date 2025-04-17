import axios from 'axios';
import { Supplier, SupplierFormData } from '../types/supplier';

// Use the Cloudflare endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const uploadFile = async (formData: FormData): Promise<{ url: string }> => {
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createSupplier = async (formData: FormData): Promise<Supplier> => {
  const response = await api.post('/api/suppliers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get('/api/suppliers');
  return response.data;
};

export const getSupplier = async (id: string): Promise<Supplier> => {
  const response = await api.get(`/api/suppliers/${id}`);
  return response.data;
};

export const updateSupplier = async (id: string, data: Partial<SupplierFormData>): Promise<Supplier> => {
  const response = await api.put(`/api/suppliers/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/api/suppliers/${id}`);
};

export default api; 