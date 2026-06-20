import api from './axios'

const barangApi = {
  getAll: () => api.get('/barang'),
  getById: (id) => api.get(`/barang/${id}`),
  create: (data) => api.post('/barang', data),
  update: (id, data) => api.put(`/barang/${id}`, data),
  delete: (id) => api.delete(`/barang/${id}`),
  getLowStock: () => api.get('/barang/low-stock'),
}

export default barangApi