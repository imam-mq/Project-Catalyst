import api from './axios'

const barangMasukApi = {
  getAll: () => api.get('/barang-masuk'),
  getById: (id) => api.get(`/barang-masuk/${id}`),
  create: (data) => api.post('/barang-masuk', data),
}

export default barangMasukApi