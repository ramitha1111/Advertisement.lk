// for docker
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.ad.localhost/api',
  credintials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

export default api

//for local
// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true 
// })

// export default api
