import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true 
})

export default api

// for hosting
// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   withCredentials: true 
// })

// export default api
