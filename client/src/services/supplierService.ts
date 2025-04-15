import axios from 'axios';
import { Supplier } from '../types/supplier';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const supplierService = {
  // Get all suppliers
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await axios.get(`${API_URL}/suppliers`);
    return response.data;
  },

  // Get a single supplier
  getSupplier: async (id: string): Promise<Supplier> => {
    const response = await axios.get(`${API_URL}/suppliers/${id}`);
    return response.data;
  },

  // Create a new supplier
  createSupplier: async (supplier: Omit<Supplier, '_id'>): Promise<Supplier> => {
    const response = await axios.post(`${API_URL}/suppliers`, supplier);
    return response.data;
  },

  // Update a supplier
  updateSupplier: async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await axios.patch(`${API_URL}/suppliers/${id}`, supplier);
    return response.data;
  },

  // Delete a supplier
  deleteSupplier: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/suppliers/${id}`);
  },

  // Upload documents for a supplier
  uploadDocuments: async (id: string, files: File[], type: string): Promise<Supplier> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });
    formData.append('type', type);

    const response = await axios.post(`${API_URL}/suppliers/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default supplierService; 