import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  // Fail loudly instead of sending applicants' documents to an unexpected server.
  throw new Error('REACT_APP_API_URL is not set');
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data?.message || '提交申請時發生錯誤 Error submitting application');
    } else if (error.request) {
      throw new Error('網絡錯誤，請檢查網絡連線 Network error. Please check your connection.');
    }
    throw error;
  }
);

export const supplierApi = {
  // The browser sets the multipart boundary for FormData bodies.
  createSupplier: async (formData: FormData): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/suppliers', formData);
    return response.data;
  },
};

export default api;
