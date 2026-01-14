import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Accept: 'application/json' },
})

// Lee token si existe (persistencia tras refresh)
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const s = err.response?.status
    if (s === 401) console.warn('No autenticado o token invalido/expirado')
    return Promise.reject(err)
  }
)

export default api
