import { create } from 'axios'
import api from './axios'
import { data } from 'react-router-dom'
import { Update } from '@mui/icons-material'

const lokasiApi = {
  getAll: () => api.get('/lokasi'),
  getById: (id) => api.get(`/lokasi/${id}`),
  create: (data) => api.post('/lokasi', data),
  update: (id, data) => api.put(`/lokasi/${id}`, data),
  delete: (id) => api.delete(`/lokasi/${id}`),

}

export default lokasiApi