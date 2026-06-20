import api from './axios'

const barangKeluarApi = {
  getAll: (status) => api.get('/barang-keluar', { params: status ? { status } : {} }),
  getById: (id) => api.get(`/barang-keluar/${id}`),
  create: (data, idUser) => api.post(`/barang-keluar?idUser=${idUser}`, data),
  approve: (id, data) => api.put(`/barang-keluar/${id}/approval`, data),
  konfirmasi: (id) => api.put(`/barang-keluar/${id}/konfirmasi`),
  batal: (id) => api.put(`/barang-keluar/${id}/batal`),
}

export default barangKeluarApi