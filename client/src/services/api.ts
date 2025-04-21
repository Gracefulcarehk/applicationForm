import axios, { AxiosProgressEvent } from 'axios';
import { Supplier } from '../types/supplier';
import { config } from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.api.timeout.default,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || config.messages.errors.serverError);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error(config.messages.errors.networkError);
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
);

interface CreateSupplierResponse {
  success: boolean;
  error?: string;
  supplier?: Supplier;
  cleanupRequired?: boolean;
}

export const createSupplier = async (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<CreateSupplierResponse> => {
  try {
    const response = await api.post<CreateSupplierResponse>(
      config.api.endpoints.suppliers,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
        timeout: config.api.timeout.upload,
      }
    );

    // If cleanup is required, attempt to clean up temporary files
    if (response.data.cleanupRequired) {
      try {
        await api.post(config.api.endpoints.cleanup, {
          formData: formData,
        });
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
        // Don't throw the error as the main operation succeeded
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(config.messages.errors.timeout);
      }
      if (error.response?.status === 413) {
        throw new Error(config.messages.errors.fileTooLarge);
      }
      throw new Error(error.response?.data?.error || config.messages.errors.uploadFailed);
    }
    throw error;
  }
};

export const supplierApi = {
  getSuppliers: async () => {
    const response = await api.get<Supplier[]>(config.api.endpoints.suppliers);
    return response.data;
  },

  getSupplierById: async (id: string) => {
    const response = await api.get<Supplier>(`${config.api.endpoints.suppliers}/${id}`);
    return response.data;
  },

  updateSupplier: async (id: string, supplier: Partial<Supplier>) => {
    const response = await api.put<Supplier>(`${config.api.endpoints.suppliers}/${id}`, supplier);
    return response.data;
  },

  deleteSupplier: async (id: string) => {
    await api.delete(`${config.api.endpoints.suppliers}/${id}`);
  },
};

export default api; 