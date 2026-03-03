import apiClient from "./axiosConfig";

// Example API functions
export const api = {
  // GET request
  get: async (url: string, params?: any) => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  // POST request
  post: async (url: string, data?: any) => {
    const response = await apiClient.post(url, data);
    return response.data;
  },

  // PUT request
  put: async (url: string, data?: any) => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  // DELETE request
  delete: async (url: string) => {
    const response = await apiClient.delete(url);
    return response.data;
  },
};

export default apiClient;
