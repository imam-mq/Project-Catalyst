import api from './axios'

const logApi = {
  getAll: (idUser) => api.get('/log', { params: idUser ? { idUser } : {} }),
}

export default logApi