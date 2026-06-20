import api from './axios'

const supplierApi = {
    getAll: () => api.get('/supplier'),
    getById: (id) => api.get(`/supplier/${id}`),
    create: (data) => api.post('/supplier', data),
    update: (id, data) => api.put(`/supplier/${id}`, data),
    delete: (id) => api.delete(`/supplier/${id}`),
}

export default supplierApi