import api from './axios'
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)

const barangApi = {
  getAll: () => api.get('/barang'),
  getById: (id) => api.get(`/barang/${id}`),
  create: (data) => api.post('/barang', data),
  update: (id, data) => api.put(`/barang/${id}`, data),
  delete: (id) => api.delete(`/barang/${id}`),
  getLowStock: () => api.get('/barang/low-stock'),
}

export default barangApi