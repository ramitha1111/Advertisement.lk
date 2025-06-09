import axios from 'axios'

const api = axios.create({
  baseURL: 'http://128.199.132.175:3001/api',
  withCredentials: true 
})

export default api
